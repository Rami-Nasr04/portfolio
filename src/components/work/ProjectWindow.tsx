import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { ArrowUpRight, X } from "lucide-react";
import ProjectPreview, { EXPAND_TRANSITION } from "@/components/work/ProjectPreview";
import { buttonVariants, ICON_CONTROL } from "@/components/ui/Button";
import type { Project, ProjectDemo } from "@/config/projects";
import { cn } from "@/lib/utils";

interface ProjectWindowProps {
  project: Project;
  demo: ProjectDemo;
  onClose: () => void;
}

const CHROME_FADE = { duration: 0.25, delay: 0.28 } as const;
/** If the frame has not loaded by then, stop waiting and offer the new-tab route. */
const LOAD_TIMEOUT_MS = 12_000;
const PAGE_ID = "page";
const SCROLL_LOCK_CLASS = "scroll-locked";
const DESKTOP_RADIUS_PX = 14;
const PHONE_QUERY = "(max-width: 639px)";

type FrameState = "loading" | "ready" | "unavailable";

function hostname(url: string): string {
  return new URL(url).hostname.replace(/^www\./, "");
}

export default function ProjectWindow({ project, demo, onClose }: ProjectWindowProps) {
  const url = demo.url ?? "";
  const host = hostname(url);
  const [frame, setFrame] = useState<FrameState>(demo.embeddable ? "loading" : "unavailable");
  const [expanded, setExpanded] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = `window-title-${project.id}`;

  // Esc closes, the page behind is inert and cannot scroll, focus returns where it came from.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const page = document.getElementById(PAGE_ID);
    page?.setAttribute("inert", "");
    document.documentElement.classList.add(SCROLL_LOCK_CLASS);
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      page?.removeAttribute("inert");
      document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [onClose]);

  useEffect(() => {
    const media = window.matchMedia(PHONE_QUERY);
    const sync = () => setIsPhone(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (frame !== "loading") return;
    const timer = window.setTimeout(() => setFrame("unavailable"), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [frame]);

  // Focus leaving the last control (or the frame) wraps back to the first one.
  const wrapFocus = () => closeRef.current?.focus();

  return createPortal(
    <div className="fixed inset-0 z-50">
      <motion.div
        className="absolute inset-0 bg-scrim/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      />

      <span tabIndex={0} onFocus={wrapFocus} />
      <motion.div
        layoutId={`window-${project.id}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        transition={EXPAND_TRANSITION}
        style={{ borderRadius: isPhone ? 0 : DESKTOP_RADIUS_PX }}
        onLayoutAnimationComplete={() => setExpanded(true)}
        className="absolute inset-0 flex flex-col overflow-hidden border-border bg-surface shadow-2xl shadow-scrim/40 sm:inset-x-[5vw] sm:inset-y-[5vh] sm:border"
      >
        <motion.header
          layout="position"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={CHROME_FADE}
          className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-surface pr-2 pl-4"
        >
          <h2 id={titleId} className="min-w-0 truncate text-sm font-medium text-foreground">
            {project.name}
            <span className="font-normal text-muted-foreground">, {demo.label.toLowerCase()}</span>
          </h2>
          <span className="hidden min-w-0 truncate rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground md:block">
            {host}
          </span>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ size: "sm" }), "ml-auto shrink-0")}
          >
            Open in new tab
            <ArrowUpRight aria-hidden="true" />
          </a>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={`Close ${project.name} window`}
            className={ICON_CONTROL}
          >
            <X aria-hidden="true" />
          </button>
        </motion.header>

        <div className="relative min-h-0 flex-1 overflow-hidden bg-surface-raised">
          <ProjectPreview project={project} eager />

          {frame !== "unavailable" && (
            <>
              {/* Mounted only once the window has settled, so the expand animation stays smooth. */}
              {expanded && (
                <iframe
                  src={url}
                  title={`${project.name}, ${demo.label.toLowerCase()}`}
                  onLoad={() => setFrame("ready")}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className={cn(
                    "absolute inset-0 size-full border-0 bg-background opacity-0 transition-opacity duration-300",
                    frame === "ready" && "opacity-100",
                  )}
                />
              )}
              {frame === "loading" && (
                <motion.p
                  role="status"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={CHROME_FADE}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-surface px-4 py-2 font-mono text-xs text-muted-foreground shadow-lg shadow-scrim/20"
                >
                  Loading {host}…
                </motion.p>
              )}
            </>
          )}

          {frame === "unavailable" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={CHROME_FADE}
              className="absolute inset-0 flex items-end justify-center bg-linear-to-t from-surface via-surface/85 to-surface/10 p-5 sm:items-center sm:bg-none sm:bg-scrim/55"
            >
              <div className="w-full max-w-md rounded-card border border-border bg-surface p-6 shadow-xl shadow-scrim/30">
                <p className="text-lg font-medium text-foreground">This site opens in its own tab</p>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {demo.embeddable
                    ? `${host} is taking too long to load here.`
                    : `For security, ${host} doesn't allow itself to be shown inside another page.`}{" "}
                  The live site is one click away.
                </p>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants(), "mt-5 w-full sm:w-auto")}
                >
                  Open {host}
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
      <span tabIndex={0} onFocus={wrapFocus} />
    </div>,
    document.body,
  );
}
