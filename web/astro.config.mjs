import * as config from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default config.defineConfig({
  site: 'https://kurtmorales.com',
  output: 'static',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  server: { port: 3000, host: '0.0.0.0' },
});
