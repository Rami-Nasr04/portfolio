import { Mail } from "lucide-react";
import { SITE, WHATSAPP_URL } from "@/config/site";
import { cn } from "@/lib/utils";

interface RailIconProps {
  children: React.ReactNode;
}

/** Brand marks drawn in the same 24px stroke style as the rest of the icons. */
function RailIcon({ children }: RailIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-5"
    >
      {children}
    </svg>
  );
}

const LINKS = [
  {
    label: "GitHub",
    href: SITE.github,
    icon: (
      <RailIcon>
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </RailIcon>
    ),
  },
  {
    label: "LinkedIn",
    href: SITE.linkedin,
    icon: (
      <RailIcon>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </RailIcon>
    ),
  },
  {
    label: "WhatsApp",
    href: WHATSAPP_URL,
    icon: (
      <RailIcon>
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        <path d="M9.4 8.3c-.7 1.1 0 3.1 1.6 4.7s3.6 2.3 4.7 1.6l.4-1.2-1.6-1-.9.7c-.9-.4-1.9-1.4-2.3-2.3l.7-.9-1-1.6z" />
      </RailIcon>
    ),
  },
  { label: "Email", href: `mailto:${SITE.email}`, icon: <Mail className="size-5" aria-hidden="true" /> },
];

const LINE = "after:mt-6 after:h-24 after:w-px after:bg-border-strong after:content-['']";

/** Fixed rails that fill the page margins on wide screens: social links left, email right. */
export default function SideRails() {
  return (
    <>
      <ul
        aria-label="Elsewhere"
        className={cn("fixed bottom-0 left-10 z-30 hidden flex-col items-center gap-2 rail:flex", LINE)}
      >
        {LINKS.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              aria-label={link.label}
              className="block p-2.5 text-muted-foreground transition-[color,transform] duration-200 ease-glide hover:-translate-y-1 hover:text-accent focus-visible:-translate-y-1 focus-visible:text-accent"
            >
              {link.icon}
            </a>
          </li>
        ))}
      </ul>

      <div className={cn("fixed right-10 bottom-0 z-30 hidden flex-col items-center rail:flex", LINE)}>
        <a
          href={`mailto:${SITE.email}`}
          className="p-2.5 font-mono text-xs tracking-[0.15em] text-muted-foreground transition-[color,transform] duration-200 ease-glide [writing-mode:vertical-rl] hover:-translate-y-1 hover:text-accent focus-visible:-translate-y-1 focus-visible:text-accent"
        >
          {SITE.email}
        </a>
      </div>
    </>
  );
}
