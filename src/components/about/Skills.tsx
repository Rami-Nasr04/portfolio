import Section from "@/components/layout/Section";
import { SKILLS } from "@/config/content";

export default function Skills() {
  return (
    <Section id="skills" title="Skills">
      <dl className="divide-y divide-border border-y border-border">
        {SKILLS.map((group) => (
          <div key={group.name} className="grid gap-x-8 gap-y-3 py-6 sm:grid-cols-[11rem_minmax(0,1fr)]">
            <dt className="pt-1 font-semibold text-foreground">{group.name}</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
