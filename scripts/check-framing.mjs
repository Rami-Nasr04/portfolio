// Checks whether each demo URL allows being shown in an <iframe> and records the answer in
// src/config/framing.generated.json. Runs before every build, so the project window knows
// up front when to show the fallback instead of a blank frame.
import { readFile, writeFile } from "node:fs/promises";

const DEMOS = new URL("../src/config/demos.json", import.meta.url);
const OUT = new URL("../src/config/framing.generated.json", import.meta.url);

const demos = JSON.parse(await readFile(DEMOS, "utf8"));
const previous = JSON.parse(await readFile(OUT, "utf8").catch(() => "{}"));
const urls = [...new Set(Object.values(demos).map((demo) => demo.url).filter(Boolean))];

function blocksFraming(headers) {
  if (headers.get("x-frame-options")) return true;
  const csp = headers.get("content-security-policy") ?? "";
  const ancestors = /frame-ancestors([^;]*)/i.exec(csp)?.[1];
  // Any frame-ancestors list is treated as blocking unless it is a bare wildcard.
  return ancestors !== undefined && ancestors.trim() !== "*";
}

const result = {};
for (const url of urls) {
  try {
    const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(10_000) });
    result[url] = !blocksFraming(response.headers);
  } catch {
    // Offline or site down: keep the last known answer, default to the safe fallback.
    result[url] = previous[url] ?? false;
  }
  process.stdout.write(`${result[url] ? "frames  " : "blocked "} ${url}\n`);
}

await writeFile(OUT, `${JSON.stringify(result, null, 2)}\n`);
