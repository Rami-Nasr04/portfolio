declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { NoteMeta } from "@/config/notes";

  export const meta: NoteMeta;
  const Content: ComponentType;
  export default Content;
}
