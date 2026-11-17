import demos from "@/config/demos.json";
import framing from "@/config/framing.generated.json";

/**
 * Until the mock-data demo builds exist, empty demo slots point here in development only,
 * so the project window (and its blocked-framing fallback) can be tested on every card.
 * In production an empty slot shows "Demo in preparation" instead.
 */
const DEV_TEST_TARGET = "https://glowstonelb.com";

type DemoKey = keyof typeof demos;

export interface ProjectDemo {
  key: DemoKey;
  label: string;
  /** null = no demo yet. */
  url: string | null;
  /** false when the site refuses to be framed (X-Frame-Options / CSP frame-ancestors). */
  embeddable: boolean;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectResult {
  value: string;
  label: string;
}

export interface Project {
  id: string;
  name: string;
  kind: string;
  period: string;
  role: string;
  problem: string;
  built: string;
  stack: string[];
  results: ProjectResult[];
  /** Base path of the preview image set (…-640.avif etc.), or null for a drawn cover. */
  preview: string | null;
  demos: ProjectDemo[];
  /** Public repositories only. */
  code: ProjectLink[];
}

function demo(key: DemoKey): ProjectDemo {
  const entry = demos[key];
  const url = entry.url ?? (import.meta.env.DEV ? DEV_TEST_TARGET : null);
  const embeddable = url !== null && (framing as Record<string, boolean>)[url] === true;
  return { key, label: entry.label, url, embeddable };
}

export const PROJECTS: Project[] = [
  {
    id: "glowstone",
    name: "Glowstone",
    kind: "E-commerce store and admin studio",
    period: "Sep 2026 to present",
    role: "Sole engineer",
    problem:
      "A Lebanese brand of hand-carved stone wine racks needed a store for limited editions that can never oversell, and a way to run orders, stock, photos and newsletters from a phone.",
    built:
      "A prerendered React storefront with customer accounts and cash-on-delivery checkout, a mobile-first admin studio, and a TypeScript serverless backend on AWS. Orders are locked single transactions and safe to retry, so a double tap never creates a duplicate.",
    stack: ["TypeScript", "React", "AWS Lambda", "API Gateway", "PostgreSQL (RDS)", "Cognito", "S3", "CloudFront", "SES"],
    results: [
      { value: "100", label: "PageSpeed mobile, home page" },
      { value: "100", label: "Lighthouse SEO and accessibility" },
      { value: "1,800+", label: "automated tests" },
    ],
    preview: "/images/previews/glowstone",
    demos: [demo("glowstone-store"), demo("glowstone-studio")],
    code: [
      { label: "Frontend", url: "https://github.com/Rami-Nasr04/Glow-Stone-frontend" },
      { label: "Backend", url: "https://github.com/Rami-Nasr04/Glow-Stone-backend" },
    ],
  },
  {
    id: "sushi-tsunami",
    name: "Sushi Tsunami",
    kind: "Restaurant reservation and floor-management platform",
    period: "May 2026 to present",
    role: "Sole engineer",
    problem:
      "During peak service the platform hit a live incident. I traced it to database connection exhaustion, on the system a fine-dining restaurant in Achrafieh runs its service on every day.",
    built:
      "Fixed it across three layers: connection pooling, server-side idle-session timeouts and correct transient-error status codes, then load-tested under rush-hour concurrency. The platform itself covers bookings, walk-ins, table merges, seating and billing, with four roles and TOTP multi-factor auth.",
    stack: ["TypeScript", "Node.js", "PostgreSQL", "React 19", "Cognito + TOTP MFA", "Zod", "Vitest"],
    results: [
      { value: "0 errors", label: "under load, after the fix" },
      { value: "105 ms", label: "p50 (379 ms p95)" },
      { value: "35", label: "REST endpoints" },
      { value: "82", label: "automated tests" },
    ],
    preview: null,
    demos: [demo("tsu")],
    code: [{ label: "Frontend", url: "https://github.com/Rami-Nasr04/TSU-reservation-system" }],
  },
  {
    id: "arome-gourmet",
    name: "Arome Gourmet",
    kind: "Coffee-trade marketing MVP",
    period: "2026",
    role: "Sole engineer",
    problem: "A coffee-trade business needed a marketing site that works equally well in English and Arabic.",
    built:
      "A bilingual English and Arabic site with full right-to-left support, an interactive Three.js origins globe and prerendered pages for SEO. Delivered on the agreed timeline.",
    stack: ["React", "Vite", "Three.js", "i18n / RTL", "Prerendering"],
    results: [
      { value: "EN / AR", label: "bilingual, full RTL" },
      { value: "On time", label: "delivered as agreed" },
    ],
    preview: "/images/previews/arome",
    demos: [demo("arome")],
    code: [{ label: "Code", url: "https://github.com/Rami-Nasr04/arome-gourmet" }],
  },
  {
    id: "ayssar-tarabay",
    name: "Ayssar Tarabay",
    kind: "Tattoo-artist portfolio",
    period: "2026",
    role: "Sole engineer",
    problem: "A tattoo artist needed a portfolio that shows the work at its best and gets found on search.",
    built:
      "A live portfolio with motion design and a custom image pipeline, deployed on Vercel. Delivered on the agreed timeline.",
    stack: ["Motion design", "Custom image pipeline", "Technical SEO", "Vercel"],
    results: [
      { value: "100 / 100", label: "Lighthouse SEO" },
      { value: "On time", label: "delivered as agreed" },
    ],
    preview: "/images/previews/ayssar",
    demos: [demo("ayssar")],
    code: [{ label: "Code", url: "https://github.com/Rami-Nasr04/ayssarportfolio" }],
  },
  {
    id: "wasselni",
    name: "Wasselni",
    kind: "Ride-sharing, fleet and route-tracking platform",
    period: "Jul to Dec 2025",
    role: "University capstone, two-person team",
    problem:
      "A transport and logistics platform has to model drivers, vehicles, routes, ordered stops, scheduling and capacity.",
    built:
      "Most of the frontend and backend, as one of two developers working through Git branches and reviews: a normalized MySQL schema on Amazon RDS, and Mapbox GL routing, ETAs and geocoding proxied server-side so API keys never reach the browser.",
    stack: ["MySQL (RDS)", "REST API", "Mapbox GL", "Cognito"],
    results: [
      { value: "30", label: "REST endpoints" },
      { value: "6", label: "related entities in the schema" },
    ],
    preview: null,
    demos: [],
    code: [],
  },
];
