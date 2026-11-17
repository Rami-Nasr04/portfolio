import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface MonogramProps {
  /** Draws the strokes in on mount. Otherwise renders the finished mark. */
  draw?: boolean;
  className?: string;
}

const DRAW_SECONDS = 0.6;

/** The R and the N share one continuous weight; the R's leg leans into the N's stem. */
const STROKES = ["M9 31V9h8.5a6 6 0 0 1 0 12H9", "M16.5 21 23 31", "M28 31V9l12 22V9"];

export default function Monogram({ draw = false, className }: MonogramProps) {
  return (
    <svg
      viewBox="0 0 48 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-7 w-auto", className)}
    >
      {STROKES.map((d, index) =>
        draw ? (
          <motion.path
            key={d}
            d={d}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: {
                duration: index === 1 ? DRAW_SECONDS * 0.4 : DRAW_SECONDS * 0.75,
                delay: index * DRAW_SECONDS * 0.2,
                ease: [0.65, 0, 0.35, 1],
              },
              opacity: { duration: 0.01, delay: index * DRAW_SECONDS * 0.2 },
            }}
          />
        ) : (
          <path key={d} d={d} />
        ),
      )}
    </svg>
  );
}
