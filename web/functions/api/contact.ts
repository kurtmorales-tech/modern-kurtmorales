interface Env {
  RESEND_API_KEY?: string;
  CONTACT_EMAIL?: string;
}

interface ContactPayload {
  name: string;
  email: string;
  project?: string;
  budget?: string;
  message: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const body = await request.json() as ContactPayload;
    const { name, email, project, budget, message } = body;

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400, headers });
    }

    const toEmail = env.CONTACT_EMAIL || 'email@kurtmorales.com';

    // If Resend API key is configured, send email
    if (env.RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'KurtMorales Contact <onboarding@resend.dev>',
          to: [toEmail],
          reply_to: email,
          subject: `New contact from ${name} — ${project || 'General Inquiry'}`,
          html: `
            <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;border:1px solid #e5e7eb;">
              <h2 style="color:#827169;font-size:24px;margin-bottom:24px;">New Contact Form Submission</h2>
              <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:8px 0;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;width:120px;">Name</td><td style="padding:8px 0;">${name}</td></tr>
                <tr><td style="padding:8px 0;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="padding:8px 0;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;">Project</td><td style="padding:8px 0;">${project || '—'}</td></tr>
                <tr><td style="padding:8px 0;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;">Budget</td><td style="padding:8px 0;">${budget || '—'}</td></tr>
              </table>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
              <p style="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#9ca3af;margin-bottom:12px;">Message</p>
              <p style="color:#374151;line-height:1.6;white-space:pre-wrap;">${message}</p>
            </div>
          `,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error('Resend error:', err);
        return new Response(JSON.stringify({ error: 'Failed to send email' }), { status: 500, headers });
      }

      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    }

    // No email service configured — log and return success (form still works, just no email)
    console.log('Contact form submission (no email service configured):', { name, email, project, budget, message });
    return new Response(JSON.stringify({ ok: true, note: 'Saved (no email service configured)' }), { status: 200, headers });

  } catch (err) {
    console.error('Contact form error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
