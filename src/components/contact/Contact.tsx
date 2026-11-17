import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Download, Mail, MessageCircle } from "lucide-react";
import Section from "@/components/layout/Section";
import { Button, buttonVariants } from "@/components/ui/Button";
import { SITE } from "@/config/site";
import { sendContactMessage, whatsappLink, type ContactFields } from "@/services/contact";
import { cn } from "@/lib/utils";

interface ContactProps {
  initialSubject?: string;
  initialMessage?: string;
}

interface FieldProps {
  label: string;
  name: keyof ContactFields;
  value: string;
  onChange: (name: keyof ContactFields, value: string) => void;
  type?: string;
  autoComplete?: string;
  optional?: boolean;
  multiline?: boolean;
  maxLength: number;
}

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme: "auto";
      callback: (token: string) => void;
      "expired-callback": () => void;
    },
  ) => string;
  reset: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const TURNSTILE_SITE_KEY: string | undefined = import.meta.env.VITE_TURNSTILE_SITE_KEY;
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const EMPTY: ContactFields = { name: "", email: "", company: "", subject: "", message: "" };
const INPUT =
  "mt-2 block w-full rounded-control border border-border-strong bg-surface px-4 py-3 text-foreground transition-colors duration-200 placeholder:text-dim focus:border-accent focus:outline-none";

const LINKS = [
  { label: SITE.email, href: `mailto:${SITE.email}` },
  { label: "LinkedIn", href: SITE.linkedin },
  { label: "GitHub", href: SITE.github },
];

function Field({ label, name, value, onChange, type = "text", autoComplete, optional = false, multiline = false, maxLength }: FieldProps) {
  const id = `contact-${name}`;
  const shared = {
    id,
    name,
    value,
    required: !optional,
    maxLength,
    autoComplete,
    className: cn(INPUT, multiline && "min-h-40 resize-y"),
  };
  return (
    <div className={cn(multiline && "sm:col-span-2")}>
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {optional && <span className="ml-2 font-normal text-muted-foreground">optional</span>}
      </label>
      {multiline ? (
        <textarea {...shared} onChange={(event) => onChange(name, event.target.value)} />
      ) : (
        <input {...shared} type={type} onChange={(event) => onChange(name, event.target.value)} />
      )}
    </div>
  );
}

export default function Contact({ initialSubject = "", initialMessage = "" }: ContactProps) {
  const [fields, setFields] = useState<ContactFields>({ ...EMPTY, subject: initialSubject, message: initialMessage });
  const [website, setWebsite] = useState("");
  const [token, setToken] = useState("");
  const [sending, setSending] = useState(false);
  const [touched, setTouched] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  const change = (name: keyof ContactFields, value: string) => setFields((current) => ({ ...current, [name]: value }));

  // The Turnstile script loads only once someone starts using the form.
  useEffect(() => {
    if (!touched || !TURNSTILE_SITE_KEY) return;
    const sitekey = TURNSTILE_SITE_KEY;
    const render = () => {
      if (!window.turnstile || !widgetRef.current || widgetId.current !== null) return;
      widgetId.current = window.turnstile.render(widgetRef.current, {
        sitekey,
        theme: "auto",
        callback: setToken,
        "expired-callback": () => setToken(""),
      });
    };
    if (window.turnstile) {
      render();
      return;
    }
    const script = document.createElement("script");
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.addEventListener("load", render);
    document.head.append(script);
    return () => script.removeEventListener("load", render);
  }, [touched]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (TURNSTILE_SITE_KEY && !token) {
      toast.error("Please wait for the spam check to finish, then send again.");
      return;
    }
    setSending(true);
    const result = await sendContactMessage({ ...fields, website, turnstileToken: token });
    setSending(false);
    if (!result.success) {
      toast.error(result.error ?? "The message could not be sent.");
      return;
    }
    toast.success("Message sent. I'll reply by email.");
    setFields(EMPTY);
    setToken("");
    if (widgetId.current !== null) window.turnstile?.reset(widgetId.current);
  };

  return (
    <Section
      id="contact"
      title="Contact"
      intro="Tell me what you need. The form reaches my inbox, and the WhatsApp button carries the same message."
    >
      <div className="grid items-start gap-x-14 gap-y-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <form onSubmit={submit} onFocus={() => setTouched(true)} className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" name="name" value={fields.name} onChange={change} autoComplete="name" maxLength={100} />
          <Field label="Email" name="email" type="email" value={fields.email} onChange={change} autoComplete="email" maxLength={200} />
          <Field label="Company" name="company" value={fields.company} onChange={change} autoComplete="organization" optional maxLength={100} />
          <Field label="Subject" name="subject" value={fields.subject} onChange={change} maxLength={200} />
          <Field label="Message" name="message" value={fields.message} onChange={change} multiline maxLength={5000} />

          {/* Honeypot: hidden from people, tempting for bots. */}
          <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>

          <div ref={widgetRef} className="empty:hidden sm:col-span-2" />

          <div className="flex flex-wrap gap-4 sm:col-span-2">
            <Button type="submit" disabled={sending}>
              <Mail aria-hidden="true" />
              {sending ? "Sending…" : "Send message"}
            </Button>
            <a href={whatsappLink(fields)} target="_blank" rel="noreferrer" className={buttonVariants()}>
              <MessageCircle aria-hidden="true" />
              Send via WhatsApp
            </a>
          </div>
        </form>

        <div>
          <h3 className="font-semibold text-foreground">Or reach me directly</h3>
          <ul className="mt-4 space-y-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer"
                  className="font-mono text-sm break-all text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={SITE.cvPath} download className={cn(buttonVariants({ size: "sm" }), "mt-6")}>
            <Download aria-hidden="true" />
            Download resume
          </a>
        </div>
      </div>
    </Section>
  );
}
