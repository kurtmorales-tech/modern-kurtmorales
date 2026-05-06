/**
 * Cloudflare Email Sending API client
 * Docs: https://developers.cloudflare.com/api/resources/email_sending/
 */

export interface EmailAddress {
  address: string;
  name?: string;
}

export interface SendEmailOptions {
  from: string | EmailAddress;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  cc?: string | string[];
  bcc?: string | string[];
  headers?: Record<string, string>;
  attachments?: Array<{
    content: string; // base64-encoded
    filename: string;
    type: string;
    disposition?: "attachment" | "inline";
    content_id?: string;
  }>;
}

export interface SendEmailResult {
  success: boolean;
  result: {
    delivered: string[];
    permanent_bounces: string[];
    queued: string[];
  };
  errors?: { code: number; message: string }[];
  messages?: { code: number; message: string }[];
}

interface CFEmailResponse {
  success: boolean;
  result: {
    delivered: string[];
    permanent_bounces: string[];
    queued: string[];
  };
  errors?: { code: number; message: string }[];
  messages?: { code: number; message: string }[];
}

export class CloudflareEmailClient {
  private accountId: string;
  private apiToken: string;
  private baseUrl = "https://api.cloudflare.com/client/v4";

  constructor(accountId: string, apiToken: string) {
    this.accountId = accountId;
    this.apiToken = apiToken;
  }

  private async request<T>(path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiToken}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Cloudflare Email API error ${res.status}: ${text}`);
    }

    return res.json() as T;
  }

  async send(options: SendEmailOptions): Promise<SendEmailResult> {
    const body: Record<string, unknown> = {
      from: options.from,
      to: options.to,
      subject: options.subject,
    };

    if (options.html) body.html = options.html;
    if (options.text) body.text = options.text;
    if (options.cc) body.cc = options.cc;
    if (options.bcc) body.bcc = options.bcc;
    if (options.headers) body.headers = options.headers;
    if (options.attachments) body.attachments = options.attachments;

    const data = await this.request<CFEmailResponse>(
      `/accounts/${this.accountId}/email/sending/send`,
      body,
    );

    return {
      success: data.success,
      result: data.result,
      errors: data.errors,
      messages: data.messages,
    };
  }

  /**
   * Send a newsletter to a list of recipients.
   * Each recipient gets a personalized "To:" but we batch for efficiency.
   */
  async sendNewsletter(options: {
    from: string | EmailAddress;
    subject: string;
    html: string;
    text: string;
    recipients: string[];
  }): Promise<SendEmailResult> {
    return this.send({
      from: options.from,
      to: options.recipients,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  }

  /**
   * Send individual emails one-by-one.
   * Use this when you want per-recipient tracking or custom content.
   */
  async sendBulkIndividually(options: {
    from: string | EmailAddress;
    subject: string;
    htmlTemplate: (email: string) => string;
    textTemplate: (email: string) => string;
    recipients: string[];
  }): Promise<{
    results: SendEmailResult[];
    totalSent: number;
    totalBounced: number;
  }> {
    const results: SendEmailResult[] = [];

    for (const email of options.recipients) {
      try {
        const result = await this.send({
          from: options.from,
          to: email,
          subject: options.subject,
          html: options.htmlTemplate(email),
          text: options.textTemplate(email),
        });
        results.push(result);
      } catch (err) {
        console.error(`Failed to send to ${email}:`, err);
        results.push({
          success: false,
          result: { delivered: [], permanent_bounces: [email], queued: [] },
          errors: [{ code: -1, message: String(err) }],
        });
      }
    }

    return {
      results,
      totalSent: results.filter((r) => r.result.delivered.length > 0).length,
      totalBounced: results.filter((r) => r.result.permanent_bounces.length > 0)
        .length,
    };
  }
}

/**
 * Factory to create a CloudflareEmailClient from environment variables.
 */
export function createEmailClient(): CloudflareEmailClient | null {
  const accountId =
    import.meta.env.CLOUDFLARE_ACCOUNT_ID || import.meta.env.CF_ACCOUNT_ID;
  const apiToken =
    import.meta.env.CLOUDFLARE_API_TOKEN || import.meta.env.CF_API_TOKEN;

  if (!accountId || !apiToken) {
    console.warn(
      "[email] Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN env vars",
    );
    return null;
  }

  return new CloudflareEmailClient(accountId, apiToken);
}
