import { cn } from "@/lib/utils";

interface MonogramProps {
  /** Marks the strokes for the intro, which app.css animates: outline draws, letters fade in. */
  intro?: boolean;
  className?: string;
}

const OUTLINE = "M14 4h20a10 10 0 0 1 10 10v20a10 10 0 0 1-10 10H14A10 10 0 0 1 4 34V14A10 10 0 0 1 14 4z";
/** The R and the N share one continuous weight; the R's leg leans into the N's stem. */
const LETTERS = ["M9 31V9h8.5a6 6 0 0 1 0 12H9", "M16.5 21 23 31", "M28 31V9l12 22V9"];
const LETTERS_TRANSFORM = "translate(24 24) scale(0.68) translate(-24.5 -20)";

export default function Monogram({ intro = false, className }: MonogramProps) {
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
      <path d={OUTLINE} strokeWidth="2" pathLength={1} className={cn(intro && "intro-outline")} />
      <g transform={LETTERS_TRANSFORM} strokeWidth="3.4" className={cn(intro && "intro-letters")}>
        {LETTERS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  );
}
