import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  // Static site: every route is prerendered to HTML at build time, no server.
  ssr: false,
  prerender: true,
} satisfies Config;
