/**
 * Contact form endpoint (Vercel Function). Checks the honeypot and Cloudflare Turnstile,
 * validates the fields, then emails the message through Resend.
 *
 * Environment variables (set in Vercel, never in the repo):
 *   RESEND_API_KEY        required
 *   CONTACT_FROM          required, a sender on a domain verified in Resend
 *   CONTACT_TO            optional, defaults to DEFAULT_TO
 *   TURNSTILE_SECRET_KEY  required in production; without it the check is skipped
 */

interface ContactBody {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  website: string;
  turnstileToken: string;
}

interface ApiResponse {
  success: boolean;
  error?: string;
}

const DEFAULT_TO = "rami.nasrr04@gmail.com";
const MAX_BODY_BYTES = 20_000;
const LIMITS = { name: 100, email: 200, company: 100, subject: 200, message: 5000 } as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND_URL = "https://api.resend.com/emails";

function json(body: ApiResponse, status: number): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function parse(raw: unknown): ContactBody | string {
  if (typeof raw !== "object" || raw === null) return "Invalid request.";
  const input = raw as Record<string, unknown>;
  const body: ContactBody = {
    name: text(input.name),
    email: text(input.email),
    company: text(input.company),
    subject: text(input.subject),
    message: text(input.message),
    website: text(input.website),
    turnstileToken: text(input.turnstileToken),
  };
  if (!body.name || !body.email || !body.subject || !body.message) return "Please fill in name, email, subject and message.";
  if (!EMAIL_PATTERN.test(body.email)) return "Please enter a valid email address.";
  for (const [field, limit] of Object.entries(LIMITS)) {
    if (body[field as keyof typeof LIMITS].length > limit) return `The ${field} is too long.`;
  }
  // Header fields must stay on one line.
  if (/[\r\n]/.test(body.name + body.email + body.subject)) return "Invalid request.";
  return body;
}

async function passesTurnstile(token: string, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set("remoteip", ip);
  const response = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body: form });
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const rawText = await request.text();
    if (rawText.length > MAX_BODY_BYTES) return json({ success: false, error: "The message is too long." }, 413);

    let raw: unknown;
    try {
      raw = JSON.parse(rawText);
    } catch {
      return json({ success: false, error: "Invalid request." }, 400);
    }

    const body = parse(raw);
    if (typeof body === "string") return json({ success: false, error: body }, 400);

    // A filled honeypot means a bot. Answer as if it worked so it learns nothing.
    if (body.website) return json({ success: true }, 200);

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    if (!(await passesTurnstile(body.turnstileToken, ip))) {
      return json({ success: false, error: "The spam check failed. Please reload the page and try again." }, 403);
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM;
    if (!apiKey || !from) return json({ success: false, error: "The contact form is not set up yet." }, 503);

    const lines = [
      `Name: ${body.name}`,
      `Email: ${body.email}`,
      `Company: ${body.company || "-"}`,
      `Subject: ${body.subject}`,
      "",
      body.message,
    ];
    const send = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [process.env.CONTACT_TO ?? DEFAULT_TO],
        reply_to: body.email,
        subject: `Portfolio: ${body.subject}`,
        text: lines.join("\n"),
      }),
    });
    if (!send.ok) return json({ success: false, error: "The message could not be sent. Please try again." }, 502);

    return json({ success: true }, 200);
  } catch {
    return json({ success: false, error: "The message could not be sent. Please try again." }, 500);
  }
}
