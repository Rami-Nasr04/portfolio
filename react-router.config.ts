import { readdir, readFile } from "node:fs/promises";
import type { Config } from "@react-router/dev/config";

const NOTES_DIR = new URL("./src/notes/", import.meta.url);

/** Published notes get their own prerendered page; drafts are left out of the build. */
async function publishedNotePaths(): Promise<string[]> {
  const files = (await readdir(NOTES_DIR)).filter((file) => file.endsWith(".mdx"));
  const paths: string[] = [];
  for (const file of files) {
    const source = await readFile(new URL(file, NOTES_DIR), "utf8");
    if (/draft:\s*false/.test(source)) paths.push(`/notes/${file.replace(/\.mdx$/, "")}`);
  }
  return paths;
}

export default {
  appDirectory: "src",
  // Static site: every page is prerendered to HTML at build time, no server.
  ssr: false,
  prerender: async () => ["/", ...(await publishedNotePaths())],
} satisfies Config;
