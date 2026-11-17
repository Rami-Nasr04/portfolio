import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface MonogramProps {
  /** Plays the intro: the outline draws itself, then the letters fade in. */
  draw?: boolean;
  className?: string;
}

export const OUTLINE_SECONDS = 1;
export const LETTERS_SECONDS = 0.4;

const OUTLINE = "M14 4h20a10 10 0 0 1 10 10v20a10 10 0 0 1-10 10H14A10 10 0 0 1 4 34V14A10 10 0 0 1 14 4z";
/** The R and the N share one continuous weight; the R's leg leans into the N's stem. */
const LETTERS = ["M9 31V9h8.5a6 6 0 0 1 0 12H9", "M16.5 21 23 31", "M28 31V9l12 22V9"];
const LETTERS_TRANSFORM = "translate(24 24) scale(0.68) translate(-24.5 -20)";

export default function Monogram({ draw = false, className }: MonogramProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-10", className)}
    >
      {draw ? (
        <motion.path
          d={OUTLINE}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: OUTLINE_SECONDS, ease: [0.65, 0, 0.35, 1] }}
        />
      ) : (
        <path d={OUTLINE} strokeWidth="2" />
      )}
      <g transform={LETTERS_TRANSFORM} strokeWidth="3.4">
        <motion.g
          initial={draw ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: LETTERS_SECONDS, delay: OUTLINE_SECONDS, ease: "easeOut" }}
        >
          {LETTERS.map((d) => (
            <path key={d} d={d} />
          ))}
        </motion.g>
      </g>
    </svg>
  );
}
