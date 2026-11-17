# Rami Nasr — Portfolio

My personal site: selected client work, how I build, and how to reach me.

**Live:** [rami-nasr.vercel.app](https://rami-nasr.vercel.app)

## What is in it

- **Selected work** as case studies: the problem, what I built, the stack and measured results.
- **A project window.** "Live demo" expands the card into a window and loads the project inside the page. A build step checks which sites allow framing; the ones that do not get a preview and an "Open in new tab" fallback.
- **Two interactive architecture diagrams** (SVG): requests flow along the edges, and each part explains what it does and why it is there.
- **Services as a small storefront.** Chosen packages pre-fill the contact form and the WhatsApp message. Nothing is charged.
- **Contact form** with a honeypot and Cloudflare Turnstile, sent by a serverless function.
- Light and dark themes, reduced-motion support, and keyboard access throughout.

## Stack

React 19 · React Router 8 (framework mode, prerendered to static HTML) · TypeScript (strict) · Vite · Tailwind CSS 4 · Motion · MDX · Vercel

## Getting started

```bash
npm install
npm run dev
```

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Check demo framing, write `sitemap.xml` and `robots.txt`, prerender into `build/client` |
| `npm run preview` | Serve the build locally |
| `npm run lint` | ESLint |
| `npm run type-check` | Generate route types and type-check |

## Configuration

Site-wide values (URL, name, contact details) live in `src/config/site.ts`. Projects, diagrams, services, testimonials and notes are data files in `src/config` and `src/notes`.

The contact function (`api/contact.ts`) reads these environment variables:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Sends the email |
| `CONTACT_FROM` | Sender address on a verified domain |
| `CONTACT_TO` | Recipient (optional) |
| `TURNSTILE_SECRET_KEY` | Verifies the spam check |
| `VITE_TURNSTILE_SITE_KEY` | Turnstile site key, used at build time |

`vite` is pinned to 8.3.1.

## Author

**Rami Nasr**, full-stack developer · [LinkedIn](https://www.linkedin.com/in/rami-nasr-dev) · [GitHub](https://github.com/Rami-Nasr04)
