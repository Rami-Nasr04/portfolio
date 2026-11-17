import { SITE, WHATSAPP_URL } from "@/config/site";

export interface ContactFields {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
}

export interface ContactPayload extends ContactFields {
  /** Honeypot. Real visitors never fill it. */
  website: string;
  turnstileToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  /** True when the email service itself is not available, as opposed to a rejected message. */
  unavailable?: boolean;
}

const ENDPOINT = "/api/contact";
const FALLBACK_ERROR = `The message could not be sent. Please email ${SITE.email} or use WhatsApp.`;

export async function sendContactMessage(payload: ContactPayload): Promise<ApiResponse<null>> {
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await response.json().catch(() => null)) as ApiResponse<null> | null;
    if (response.ok && body?.success) return { success: true };
    const unavailable = response.status === 404 || response.status >= 500;
    return { success: false, error: body?.error ?? FALLBACK_ERROR, unavailable };
  } catch {
    return { success: false, error: FALLBACK_ERROR, unavailable: true };
  }
}

/** A mailto link carrying the filled form, used when the email service is unavailable. */
export function mailtoLink(fields: ContactFields): string {
  const lines = [fields.message, "", fields.name, fields.company].filter((line, index) => index < 2 || line);
  const query = `subject=${encodeURIComponent(fields.subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  return `mailto:${SITE.email}?${query}`;
}

/** A wa.me link with the filled form as the message, so the visitor only presses send. */
export function whatsappLink(fields: ContactFields): string {
  const lines = [
    fields.subject && `*${fields.subject}*`,
    fields.message,
    "",
    fields.name && `Name: ${fields.name}`,
    fields.company && `Company: ${fields.company}`,
    fields.email && `Email: ${fields.email}`,
  ].filter((line): line is string => typeof line === "string");
  const text = lines.join("\n").trim() || "Hi Rami, I found you through your portfolio.";
  return `${WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
}
