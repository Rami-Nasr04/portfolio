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

/** The shared frame of every page section: container, heading and intro line. */
export default function Section({ id, title, intro, action, className, children }: SectionProps) {
  return (
    <section id={id} tabIndex={-1} aria-labelledby={`${id}-title`} className="outline-none">
      <div className={cn("mx-auto max-w-page px-5 py-20 sm:px-8 sm:py-28 rail:px-24", className)}>
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
          <div>
            <h2 id={`${id}-title`} className="text-title font-semibold">
              {title}
            </h2>
            {intro && <p className="mt-3 max-w-xl text-lg text-muted-foreground">{intro}</p>}
          </div>
          {action}
        </div>
        <div className="mt-12 sm:mt-14">{children}</div>
      </div>
    </section>
  );
}
