import Section from "@/components/layout/Section";
import { EXPERIENCE } from "@/config/content";

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="relative space-y-12 border-l border-border-strong pl-7 sm:pl-10">
        {EXPERIENCE.map((entry) => (
          <li key={entry.role} className="relative">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-7 size-2.5 -translate-x-[calc(50%+0.5px)] rounded-full border-2 border-accent bg-background sm:-left-10"
            />
            <p className="font-mono text-sm text-accent">{entry.period}</p>
            <h3 className="mt-2 text-xl font-semibold text-foreground">{entry.role}</h3>
            <p className="mt-1 text-muted-foreground">{entry.place}</p>
            <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-5 text-[0.9375rem] leading-relaxed text-muted-foreground marker:text-accent">
              {entry.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
