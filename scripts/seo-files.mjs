// Writes public/robots.txt and public/sitemap.xml from the single SITE.url value in
// src/config/site.ts, so a domain change never leaves a stale URL behind. Runs before every build.
import { readdir, readFile, writeFile } from "node:fs/promises";

const site = await readFile(new URL("../src/config/site.ts", import.meta.url), "utf8");
const url = /url:\s*"([^"]+)"/.exec(site)?.[1];
if (!url) throw new Error("SITE.url not found in src/config/site.ts");

const notesDir = new URL("../src/notes/", import.meta.url);
const paths = ["/"];
for (const file of await readdir(notesDir)) {
  if (!file.endsWith(".mdx")) continue;
  const source = await readFile(new URL(file, notesDir), "utf8");
  if (/draft:\s*false/.test(source)) paths.push(`/notes/${file.replace(/\.mdx$/, "")}`);
}

const entries = paths.map((path) => `  <url><loc>${url}${path === "/" ? "/" : path}</loc></url>`).join("\n");
await writeFile(
  new URL("../public/sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`,
);
await writeFile(new URL("../public/robots.txt", import.meta.url), `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`);
process.stdout.write(`seo files written for ${url}\n`);
