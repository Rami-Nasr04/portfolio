import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Monogram from "@/components/layout/Monogram";

const SEEN_KEY = "intro-seen";
const INTRO_CLASS = "intro";
const DRAW_MS = 700;
const TRAVEL_SECONDS = 0.55;
const PLATE_PX = 96;

/**
 * Runs in <head>. Marks the document for the intro only on the first visit of a session and
 * never under reduced motion, so the nav logo can stay hidden until the mark lands on it.
 */
export const INTRO_INIT_SCRIPT = `(function(){try{if(!sessionStorage.getItem("${SEEN_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("${INTRO_CLASS}")}}catch(e){}})()`;

interface Travel {
  x: number;
  y: number;
  scale: number;
}

/**
 * The RN mark draws itself on a small plate, then glides into the nav logo slot.
 * It sits above the page without covering it: content is readable the whole time.
 */
export default function MonogramIntro() {
  const [phase, setPhase] = useState<"idle" | "draw" | "travel">("idle");
  const [travel, setTravel] = useState<Travel>({ x: 0, y: 0, scale: 1 });

  const finish = () => {
    document.documentElement.classList.remove(INTRO_CLASS);
    setPhase("idle");
  };

  useEffect(() => {
    if (!document.documentElement.classList.contains(INTRO_CLASS)) return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Without storage the intro simply plays again next time.
    }
    const start = requestAnimationFrame(() => setPhase("draw"));

    const timer = window.setTimeout(() => {
      const logo = document.getElementById("nav-logo")?.getBoundingClientRect();
      if (!logo) {
        finish();
        return;
      }
      const plateCentreX = window.innerWidth / 2;
      const plateCentreY = window.innerHeight * 0.4;
      setTravel({
        x: logo.left + logo.width / 2 - plateCentreX,
        y: logo.top + logo.height / 2 - plateCentreY,
        scale: logo.height / (PLATE_PX * 0.5),
      });
      setPhase("travel");
    }, DRAW_MS);

    return () => {
      cancelAnimationFrame(start);
      window.clearTimeout(timer);
    };
  }, []);

  if (phase === "idle") return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-50">
      <motion.div
        className="absolute top-[40%] left-1/2 -mt-12 -ml-12 flex size-24 items-center justify-center"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={phase === "travel" ? { opacity: 1, ...travel } : { opacity: 1, scale: 1 }}
        transition={
          phase === "travel"
            ? { duration: TRAVEL_SECONDS, ease: [0.16, 1, 0.3, 1] }
            : { duration: 0.18 }
        }
        onAnimationComplete={() => {
          if (phase === "travel") finish();
        }}
      >
        <motion.span
          className="absolute inset-0 rounded-card border border-border bg-surface shadow-lg shadow-scrim/20"
          animate={{ opacity: phase === "travel" ? 0 : 1 }}
          transition={{ duration: 0.25 }}
        />
        <Monogram draw className="relative h-12 text-foreground" />
      </motion.div>
    </div>
  );
}
