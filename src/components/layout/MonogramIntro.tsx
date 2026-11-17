import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Monogram, { LETTERS_SECONDS, OUTLINE_SECONDS } from "@/components/layout/Monogram";

const SEEN_KEY = "intro-seen";
const INTRO_CLASS = "intro";
/** Fades the veil out while the mark travels. */
const LEAVING_CLASS = "intro-out";
const TRAVEL_SECONDS = 0.4;
const MARK_PX = 144;
const SKIP_EVENTS = ["pointerdown", "keydown", "wheel", "touchmove"] as const;

/**
 * Runs in <head>. Marks the document for the intro only on the first visit of a session and
 * never under reduced motion, so the veil and the hidden nav logo are right from first paint.
 */
export const INTRO_INIT_SCRIPT = `(function(){try{if(!sessionStorage.getItem("${SEEN_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("${INTRO_CLASS}")}}catch(e){}})()`;

type Travel = { x: number; y: number; scale: number };

function endIntro(): void {
  document.documentElement.classList.remove(INTRO_CLASS, LEAVING_CLASS);
}

/**
 * About 1.8 s in all: the outline draws, "RN" fades in, then the mark scales down into the
 * nav logo slot. Any click, key press or scroll skips it.
 */
export default function MonogramIntro() {
  const [phase, setPhase] = useState<"idle" | "draw" | "travel">("idle");
  const [travel, setTravel] = useState<Travel>({ x: 0, y: 0, scale: 1 });

  useEffect(() => {
    if (!document.documentElement.classList.contains(INTRO_CLASS)) return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Without storage the intro simply plays again next time.
    }

    const finish = () => {
      endIntro();
      setPhase("idle");
    };
    const start = requestAnimationFrame(() => setPhase("draw"));

    const timer = window.setTimeout(
      () => {
        const logo = document.getElementById("nav-logo")?.getBoundingClientRect();
        if (!logo || logo.height === 0) {
          finish();
          return;
        }
        setTravel({
          x: logo.left + logo.width / 2 - window.innerWidth / 2,
          y: logo.top + logo.height / 2 - window.innerHeight * 0.42,
          scale: logo.height / MARK_PX,
        });
        document.documentElement.classList.add(LEAVING_CLASS);
        setPhase("travel");
      },
      (OUTLINE_SECONDS + LETTERS_SECONDS) * 1000,
    );

    SKIP_EVENTS.forEach((type) => window.addEventListener(type, finish, { passive: true }));

    return () => {
      cancelAnimationFrame(start);
      window.clearTimeout(timer);
      SKIP_EVENTS.forEach((type) => window.removeEventListener(type, finish));
    };
  }, []);

  if (phase === "idle") return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50">
      <motion.div
        className="absolute top-[42%] left-1/2 -mt-18 -ml-18 size-36 text-accent"
        animate={phase === "travel" ? travel : { x: 0, y: 0, scale: 1 }}
        transition={{ duration: TRAVEL_SECONDS, ease: [0.5, 0, 0.2, 1] }}
        onAnimationComplete={() => {
          if (phase !== "travel") return;
          endIntro();
          setPhase("idle");
        }}
      >
        <Monogram draw className="size-full" />
      </motion.div>
    </div>
  );
}
