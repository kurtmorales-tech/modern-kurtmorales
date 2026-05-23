import puppeteer, { type Page } from 'puppeteer';
import { spawn, execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

type CdpMetrics = Record<string, number | string>;
type PageCapture = {
  path: string;
  label: string;
  screenshot: string;
  metrics: CdpMetrics;
  network: Record<string, unknown>[];
  consoleLogs: string[];
};

const OUTPUT_DIR = resolve(__dirname, 'showcase-output');
const SCREENSHOTS_DIR = resolve(OUTPUT_DIR, 'screenshots');
const DATA_FILE = resolve(OUTPUT_DIR, 'cdp-metrics.json');
const VIDEO_FILE = resolve(OUTPUT_DIR, 'kurtmorales-showcase.mp4');

const PAGES = [
  { path: '/', label: '01 - Home — Hero & Services', captureDelay: 3000 },
  { path: '/products', label: '02 - Products — Marketplace Picks', captureDelay: 2500 },
  { path: '/templates', label: '03 - Templates — Website Templates', captureDelay: 2500 },
  { path: '/projects', label: '04 - Projects — Portfolio', captureDelay: 2500 },
  { path: '/resources', label: '05 - Resources — Docs & SEO', captureDelay: 2500 },
  { path: '/contact', label: '06 - Contact — Get in Touch', captureDelay: 2500 },
  { path: '/about', label: '07 - About', captureDelay: 2500 },
  { path: '/blog', label: '08 - Blog', captureDelay: 2500 },
];

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const CHROME_PATH = process.env.CHROME_PATH || '/usr/bin/chromium';
const FRAMERATE = Number(process.env.FRAMERATE || '5');

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

async function waitForServer(url: string, maxRetries = 30, interval = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const resp = await fetch(url);
      if (resp.ok) return;
    } catch { /* not ready yet */ }
    await new Promise(r => setTimeout(r, interval));
  }
  throw new Error(`Server at ${url} not ready after ${maxRetries * interval / 1000}s`);
}

async function captureCdpData(page: Page): Promise<CdpMetrics> {
  const cdp = await page.createCDPSession();
  await cdp.send('Performance.enable');
  await cdp.send('Runtime.enable');

  await page.evaluate(() => performance.mark('capture-start'));

  const perfMetrics = await cdp.send('Performance.getMetrics') as { metrics: { name: string; value: number }[] };
  const timing = await page.evaluate(() => {
    const t = performance.timing || performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if ('toJSON' in t) return JSON.parse(JSON.stringify(t));
    return t;
  });

  await cdp.send('Performance.disable');
  await cdp.send('Runtime.disable');

  const metrics: CdpMetrics = {};
  for (const m of perfMetrics.metrics) {
    metrics[m.name] = Math.round(m.value * 100) / 100;
  }

  const navTiming = timing as Record<string, unknown>;
  if (navTiming.domComplete !== undefined) metrics.domComplete = navTiming.domComplete as number;
  if (navTiming.loadEventEnd !== undefined) metrics.loadEventEnd = navTiming.loadEventEnd as number;
  if (navTiming.domContentLoadedEventEnd !== undefined) metrics.domContentLoadedEventEnd = navTiming.domContentLoadedEventEnd as number;

  return metrics;
}

async function captureNetworkData(page: Page): Promise<Record<string, unknown>[]> {
  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');

  const requests: Record<string, unknown>[] = [];
  const onRequest = (params: Record<string, unknown>) => {
    const req = params as { request?: { url?: string; method?: string; type?: string } };
    requests.push({
      url: req.request?.url || 'unknown',
      method: req.request?.method || 'GET',
    });
  };

  cdp.on('Network.requestWillBeSent', onRequest);
  await page.reload({ waitUntil: 'networkidle0' });
  cdp.off('Network.requestWillBeSent', onRequest);
  await cdp.send('Network.disable');

  return requests;
}

async function captureConsoleLogs(page: Page): Promise<string[]> {
  const logs: string[] = [];
  const handler = (msg: { text: () => string }) => logs.push(msg.text());

  page.on('console', handler);
  await page.evaluate(() => {
    console.log('Page URL:', window.location.href);
    console.log('Viewport:', JSON.stringify({ w: window.innerWidth, h: window.innerHeight }));
    console.log('User Agent:', navigator.userAgent);
  });
  page.off('console', handler);

  return logs;
}

async function captureCoverage(page: Page) {
  const cdp = await page.createCDPSession();
  await cdp.send('CSS.enable');
  await cdp.send('DOM.enable');
  await cdp.send('Page.enable');

  await cdp.send('CSS.startRuleUsageTracking');
  await cdp.send('Profiler.start');

  await page.evaluate(() => document.fonts.ready);

  const cssCoverage = await cdp.send('CSS.stopRuleUsageTracking');
  await cdp.send('CSS.disable');

  return {
    cssRulesUsed: (cssCoverage as { ruleUsage: unknown[] }).ruleUsage?.length || 0,
  };
}

async function main() {
  console.log(`\n  KurtMorales Website Showcase\n`);
  console.log(`  Target: ${BASE_URL}`);
  console.log(`  Output: ${OUTPUT_DIR}\n`);

  ensureDir(OUTPUT_DIR);
  ensureDir(SCREENSHOTS_DIR);

  console.log('  Waiting for dev server...');
  await waitForServer(BASE_URL);
  console.log('  Server ready.\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-extensions',
      '--mute-audio',
      '--window-size=1440,900',
    ],
  });

  const captures: PageCapture[] = [];
  const context = await browser.createBrowserContext();

  try {
    for (const pageInfo of PAGES) {
      const page = await context.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      console.log(`  📄 ${pageInfo.label}`);

      const cdp = await page.createCDPSession();
      await cdp.send('Performance.enable');
      await cdp.send('Network.enable');

      const consoleLogs: string[] = [];
      page.on('console', (msg) => consoleLogs.push(msg.text()));

      await page.goto(`${BASE_URL}${pageInfo.path}`, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      await page.evaluate(() => document.fonts.ready);
      await new Promise(r => setTimeout(r, pageInfo.captureDelay));

      await page.evaluate(() => window.scrollTo(0, 0));
      await new Promise(r => setTimeout(r, 500));

      // Capture performance metrics via CDP
      const perfResult = await cdp.send('Performance.getMetrics') as { metrics: { name: string; value: number }[] };
      const metrics: CdpMetrics = {};
      for (const m of perfResult.metrics) {
        metrics[m.name] = Math.round(m.value * 100) / 100;
      }

      // Navigation timing
      const timing = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (nav) return { domComplete: nav.domComplete, loadEventEnd: nav.loadEventEnd, domContentLoaded: nav.domContentLoadedEventEnd };
        return {};
      });
      Object.assign(metrics, timing);

      // Network info
      const networkEntries: Record<string, unknown>[] = [];
      cdp.on('Network.requestWillBeSent', (params: unknown) => {
        const p = params as { request?: { url?: string; method?: string } };
        if (p.request) networkEntries.push({ url: p.request.url, method: p.request.method });
      });
      await page.reload({ waitUntil: 'networkidle0' }).catch(() => {});
      cdp.removeAllListeners('Network.requestWillBeSent');

      await cdp.send('Performance.disable');
      await cdp.send('Network.disable');

      // Screenshot
      const screenshotPath = resolve(SCREENSHOTS_DIR, `${pageInfo.path === '/' ? 'index' : pageInfo.path.slice(1).replace(/\//g, '-')}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      // Also take a viewport screenshot
      const viewportPath = resolve(SCREENSHOTS_DIR, `${pageInfo.path === '/' ? 'index' : pageInfo.path.slice(1).replace(/\//g, '-')}-viewport.png`);
      await page.screenshot({ path: viewportPath, fullPage: false });

      captures.push({
        path: pageInfo.path,
        label: pageInfo.label,
        screenshot: screenshotPath,
        metrics,
        network: networkEntries.slice(0, 20),
        consoleLogs,
      });

      console.log(`     Metrics: ${metrics.domComplete ? `DOM ${Math.round(Number(metrics.domComplete))}ms` : ''} ${metrics.loadEventEnd ? `| Load ${Math.round(Number(metrics.loadEventEnd))}ms` : ''} | Requests: ${networkEntries.length}`);
      console.log(`     Screenshot: ${screenshotPath}`);

      await page.close();
    }

    // Write CDP metrics data
    writeFileSync(DATA_FILE, JSON.stringify(captures, null, 2));
    console.log(`\n  ✅ CDP metrics saved: ${DATA_FILE}`);

    // Generate video with FFmpeg
    console.log('\n  🎬 Generating video with FFmpeg...');

    const DUR = 8;
    const FPS = 24;
    const clipsDir = resolve(OUTPUT_DIR, 'clips');
    ensureDir(clipsDir);

    const metricsInfo = captures.map((c) => {
      const m = c.metrics;
      return {
        label: c.label.replace(/^\d+ - /, ''),
        num: c.label.match(/^(\d+)/)?.[1] || '?',
        dom: `${Math.round(Number(m.domComplete))}ms`,
        heap: `${(Number(m.JSHeapUsedSize) / 1024 / 1024).toFixed(1)}MB`,
        nodes: String(m.Nodes),
        scripts: `${Math.round(Number(m.ScriptDuration) * 1000)}ms`,
      };
    });

    const total = captures.length;

    for (let i = 0; i < captures.length; i++) {
      const c = captures[i];
      const m = metricsInfo[i];
      const imgPath = c.screenshot.replace('.png', '-viewport.png');
      const clipPath = resolve(clipsDir, `clip_${String(i).padStart(2, '0')}.mp4`);

      const filter = [
        `scale=1440:900:force_original_aspect_ratio=decrease,pad=1440:900:(ow-iw)/2:(oh-ih)/2`,
        `fps=${FPS},format=yuv420p`,
        `drawtext=text='KurtMorales Website Showcase':fontsize=20:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=6:x=40:y=40:enable='between(t,0,1)'`,
        `drawtext=text='${m.label}':fontsize=26:fontcolor=white:box=1:boxcolor=black@0.55:boxborderw=8:x=40:y=h-65:enable='gte(t,1)'`,
        `drawtext=text='Page ${m.num} / ${total}':fontsize=18:fontcolor=white:box=1:boxcolor=black@0.5:boxborderw=6:x=w-140:y=40:enable='gte(t,1)'`,
        `drawtext=text='CDP Metrics (Chrome DevTools Protocol)':fontsize=14:fontcolor=a0a0a0:box=1:boxcolor=black@0.5:boxborderw=6:x=40:y=90:enable='gte(t,1)'`,
        `drawtext=text='DOM ${m.dom} | Heap ${m.heap} | Nodes ${m.nodes} | Scripts ${m.scripts}':fontsize=15:fontcolor=7fdbff:box=1:boxcolor=black@0.5:boxborderw=6:x=40:y=115:enable='gte(t,1)'`,
      ].join(',');

      execSync(
        `ffmpeg -y -loop 1 -i "${imgPath}" -vf "${filter}" -c:v libx264 -t ${DUR} -pix_fmt yuv420p -preset ultrafast -crf 28 "${clipPath}" 2>/dev/null`,
      );
      console.log(`     Clip ${i + 1}/${total}: ${m.label}`);
    }

    // Concatenate with crossfade
    const xfadeParts: string[] = [];
    for (let i = 0; i < total; i++) {
      xfadeParts.push(
        `-i "${resolve(clipsDir, `clip_${String(i).padStart(2, '0')}.mp4`)}"`,
      );
    }

    const filterParts: string[] = [];
    for (let i = 0; i < total; i++) {
      filterParts.push(`[${i}:v]setpts=PTS-STARTPTS[v${i}]`);
    }

    for (let i = 1; i < total; i++) {
      const prev = i === 1 ? `v0` : `f${String(i - 1).padStart(2, '0')}`;
      const label = `f${String(i).padStart(2, '0')}`;
      const offset = DUR * i - i;
      filterParts.push(
        `[${prev}][v${i}]xfade=transition=fade:duration=1:offset=${offset}[${label}]`,
      );
    }

    const last = `f${String(total - 1).padStart(2, '0')}`;
    const filterComplex = filterParts.join(';\n    ');

    execSync(
      `ffmpeg -y ${xfadeParts.join(' ')} -filter_complex "${filterComplex}" -map "[${last}]" -c:v libx264 -preset medium -crf 23 "${VIDEO_FILE}" 2>&1 | tail -3`,
      { stdio: 'pipe', shell: true },
    );

    // Clean up clips
    execSync(`rm -rf "${clipsDir}"`);

    if (existsSync(VIDEO_FILE)) {
      const probe = JSON.parse(
        execSync(
          `ffprobe -v quiet -print_format json -show_format "${VIDEO_FILE}"`,
        ).toString(),
      );
      const duration = probe.format?.duration || '?';
      const size = probe.format?.size
        ? `${(Number(probe.format.size) / 1024 / 1024).toFixed(1)}MB`
        : '?';
      console.log(`  ✅ Video: ${VIDEO_FILE}`);
      console.log(`     Duration: ${Math.round(Number(duration))}s | Size: ${size}`);
    }

  } catch (err) {
    console.error('  ❌ Error:', err instanceof Error ? err.message : err);
  } finally {
    await context.close();
    await browser.close();
    console.log('\n  Done.\n');
  }
}

main();
