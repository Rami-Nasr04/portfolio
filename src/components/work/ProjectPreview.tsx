import { motion } from "motion/react";
import type { Project } from "@/config/projects";
import { cn } from "@/lib/utils";

interface ProjectPreviewProps {
  project: Project;
  /** Above-the-fold previews load eagerly; the rest are lazy. */
  eager?: boolean;
  className?: string;
}

const WIDTHS = [640, 1280];
/** Must match the window's own expand timing so picture and frame move as one. */
export const EXPAND_TRANSITION = { duration: 0.55, ease: [0.16, 1, 0.3, 1] } as const;
const SIZES = "(min-width: 1024px) 60vw, 100vw";

/**
 * The picture that travels between a card and the project window. It keeps a fixed 16:10
 * shape in both places, so the shared-element animation only ever scales it uniformly.
 */
export default function ProjectPreview({ project, eager = false, className }: ProjectPreviewProps) {
  const layoutId = `preview-${project.id}`;

  if (!project.preview) {
    return (
      <motion.div
        layoutId={layoutId}
        transition={EXPAND_TRANSITION}
        aria-hidden="true"
        className={cn(
          "relative flex aspect-[16/10] w-full flex-col justify-end bg-surface-raised p-[6%]",
          "bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:8%_12.8%]",
          className,
        )}
      >
        <span className="font-mono text-[clamp(0.7rem,1.4vw,0.875rem)] text-primary">{project.kind}</span>
        <span className="mt-1 text-[clamp(1.5rem,5vw,3.25rem)] leading-none font-semibold tracking-tight text-foreground">
          {project.name}
        </span>
      </motion.div>
    );
  }

  const srcSet = (format: "avif" | "webp") =>
    WIDTHS.map((width) => `${project.preview}-${width}.${format} ${width}w`).join(", ");

  return (
    <motion.picture layoutId={layoutId} transition={EXPAND_TRANSITION} className={cn("block aspect-[16/10] w-full", className)}>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={SIZES} />
      <source type="image/webp" srcSet={srcSet("webp")} sizes={SIZES} />
      <img
        src={`${project.preview}-1280.webp`}
        alt={`${project.name} home page`}
        width={1440}
        height={900}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="block size-full object-cover object-top"
      />
    </motion.picture>
  );
}
