import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Monogram from "@/components/layout/Monogram";

const SEEN_KEY = "intro-seen";
const INTRO_CLASS = "intro";
/** Fades the cover out, which is what fades the page in. */
const LEAVING_CLASS = "intro-out";
/** Outline (1.0 s) plus letters (0.4 s), as timed in app.css. */
const DRAW_MS = 1400;
const TRAVEL_SECONDS = 0.5;
const SKIP_EVENTS = ["pointerdown", "keydown", "wheel", "touchmove"] as const;

/**
 * Runs in <head>. Marks the document for the intro only on the first visit of a session and
 * never under reduced motion. From that moment CSS alone shows the cover and draws the mark,
 * so the intro starts with the first paint and does not wait for the scripts to load.
 */
export const INTRO_INIT_SCRIPT = `(function(){try{if(!sessionStorage.getItem("${SEEN_KEY}")&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("${INTRO_CLASS}")}}catch(e){}})()`;

type Travel = { x: number; y: number; scale: number };

function endIntro(): void {
  document.documentElement.classList.remove(INTRO_CLASS, LEAVING_CLASS);
}

/**
 * About 1.9 s in all: on a plain cover the outline draws and "RN" fades in, then the mark
 * glides into the nav logo slot while the page fades in behind it. Any click, key press or
 * scroll skips it.
 */
export default function MonogramIntro() {
  const [travel, setTravel] = useState<Travel | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!document.documentElement.classList.contains(INTRO_CLASS)) return;
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Without storage the intro simply plays again next time.
    }

    const finish = () => {
      endIntro();
      setDone(true);
    };

    // The drawing started at first paint, so only the time still left is waited for.
    const timer = window.setTimeout(
      () => {
        const mark = document.getElementById("intro-mark")?.getBoundingClientRect();
        const logo = document.getElementById("nav-logo")?.getBoundingClientRect();
        if (!mark || !logo || logo.height === 0) {
          finish();
          return;
        }
        setTravel({
          x: logo.left + logo.width / 2 - (mark.left + mark.width / 2),
          y: logo.top + logo.height / 2 - (mark.top + mark.height / 2),
          scale: logo.height / mark.height,
        });
        document.documentElement.classList.add(LEAVING_CLASS);
      },
      Math.max(0, DRAW_MS - performance.now()),
    );

    SKIP_EVENTS.forEach((type) => window.addEventListener(type, finish, { passive: true }));

    return () => {
      window.clearTimeout(timer);
      SKIP_EVENTS.forEach((type) => window.removeEventListener(type, finish));
    };
  }, []);

  if (done) return null;

  return (
    <div aria-hidden="true" className="intro-stage pointer-events-none fixed inset-0 z-50 text-accent">
      <motion.div
        id="intro-mark"
        className="absolute top-[42%] left-1/2 -mt-18 -ml-18 size-36"
        animate={travel ?? { x: 0, y: 0, scale: 1 }}
        transition={{ duration: TRAVEL_SECONDS, ease: [0.5, 0, 0.15, 1] }}
        onAnimationComplete={() => {
          if (!travel) return;
          endIntro();
          setDone(true);
        }}
      >
        <Monogram intro className="size-full" />
      </motion.div>
    </div>
  );
}
