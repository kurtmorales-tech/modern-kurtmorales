kurtmorales_modern/web/functions/api/newsletter/send/route.ts#L1-118
import type { APIRoute } from 'astro';
import { createEmailClient, CloudflareEmailClient } from '../../../../lib/email';
import { getSubscribers } from '../../../../lib/payload';

/**
 * POST /api/newsletter/send
 *
 * Sends a newsletter campaign to all subscribed users.
 *
 * Required env vars:
 *   CLOUDFLARE_ACCOUNT_ID  — Cloudflare account ID
 *   CLOUDFLARE_API_TOKEN   — Cloudflare API token with Email Sending scope
 *   NEWSLETTER_FROM       — Sender email address (e.g. "Newsletter <news@kurtmorales.com>")
 *   PAYLOAD_URL           — CMS base URL (default: http://localhost:3001)
 *   PAYLOAD_SECRET        — CMS secret for authentication
 */

export const POST: APIRoute = async ({ request }) => {
  const client = createEmailClient();

  if (!client) {
    return new Response(
      JSON.stringify({ error: 'Email service not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: { id?: string; subject?: string; html?: string; text?: string } | null = null;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const newsletterId = body?.id;
  const overrideSubject = body?.subject;
  const overrideHtml = body?.html;
  const overrideText = body?.text;

  if (!newsletterId) {
    return new Response(
      JSON.stringify({ error: 'Missing required field: id' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 1. Fetch the newsletter campaign from CMS
  const cmsUrl = import.meta.env.PAYLOAD_URL || import.meta.env.PUBLIC_CMS_URL || 'http://localhost:3001';
  const payloadSecret = import.meta.env.PAYLOAD_SECRET || 'PLEASE-CHANGE-THIS-SECRET';

  let newsletterData: {
    id: string;
    title: string;
    subject: string;
    html?: string;
    text?: string;
    status: string;
  } | null = null;

  try {
    const res = await fetch(`${cmsUrl}/api/newsletters/${newsletterId}`, {
      headers: {
        Authorization: `Bearer ${payloadSecret}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `Newsletter ${newsletterId} not found` }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const json = await res.json() as { doc?: typeof newsletterData };
    newsletterData = json.doc ?? null;
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch newsletter from CMS', details: String(err) }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!newsletterData) {
    return new Response(
      JSON.stringify({ error: `Newsletter ${newsletterId} not found` }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (newsletterData.status === 'sent') {
    return new Response(
      JSON.stringify({ error: 'This newsletter has already been sent' }),
      { status: 409, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2. Fetch subscribed recipients from CMS
  let recipients: string[] = [];
  try {
    recipients = await getSubscribers();
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch subscribers', details: String(err) }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (recipients.length === 0) {
    return new Response(
      JSON.stringify({ error: 'No subscribed recipients found' }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 3. Compose email
  const fromAddress = import.meta.env.NEWSLETTER_FROM || 'news@kurtmorales.com';
  const subject = overrideSubject || newsletterData.subject || newsletterData.title;
  const html = overrideHtml || newsletterData.html || '';
  const text = overrideText || newsletterData.text || '';

  if (!html && !text) {
    return new Response(
      JSON.stringify({ error: 'Newsletter has no content (html or text required)' }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 4. Send via Cloudflare Email Sending API
  let sendResult;
  try {
    sendResult = await client.sendNewsletter({
      from: fromAddress,
      subject,
      html,
      text,
      recipients,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Email send failed', details: String(err) }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 5. Mark newsletter as sent in CMS
  try {
    await fetch(`${cmsUrl}/api/newsletters/${newsletterId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${payloadSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'sent',
        sentAt: new Date().toISOString(),
        recipientsCount: recipients.length,
      }),
    });
  } catch (err) {
    console.warn('[newsletter/send] Failed to update CMS status:', err);
  }

  return new Response(
    JSON.stringify({
      success: sendResult.success,
      recipientsCount: recipients.length,
      result: sendResult.result,
      errors: sendResult.errors,
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
