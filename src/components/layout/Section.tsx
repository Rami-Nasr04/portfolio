import { NAV_SECTIONS } from "@/config/site";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  title: string;
  intro?: string;
  /** Extra content on the heading row, e.g. the request button in Services. */
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

interface SectionHeadingProps {
  /** The section's id; the heading gets `${id}-title`. */
  id: string;
  title: string;
}

/** A section title. Sections that are in the nav carry the same number they have there. */
export function SectionHeading({ id, title }: SectionHeadingProps) {
  const position = NAV_SECTIONS.findIndex((section) => section.id === id);
  return (
    <h2 id={`${id}-title`} className="flex items-baseline gap-3 text-title font-semibold">
      {position >= 0 && (
        <span aria-hidden="true" className="font-mono text-[0.5em] font-normal tracking-normal text-accent">
          {String(position + 1).padStart(2, "0")}.
        </span>
      )}
      {title}
    </h2>
  );
}

/** The shared frame of every page section: container, heading and intro line. */
export default function Section({ id, title, intro, action, className, children }: SectionProps) {
  return (
    <section id={id} tabIndex={-1} aria-labelledby={`${id}-title`} className="outline-none">
      <div className={cn("mx-auto max-w-page px-5 py-16 sm:px-8 sm:py-20 rail:px-24", className)}>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div>
            <SectionHeading id={id} title={title} />
            {intro && <p className="mt-3 max-w-xl text-lg text-muted-foreground">{intro}</p>}
          </div>
          {action}
        </div>
        <div className="mt-12 sm:mt-14">{children}</div>
      </div>
    </section>
  );
}
