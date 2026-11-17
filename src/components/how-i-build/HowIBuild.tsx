import { useRef, useState } from "react";
import ArchitectureDiagram from "@/components/how-i-build/ArchitectureDiagram";
import Section from "@/components/layout/Section";
import { DIAGRAMS } from "@/config/diagrams";
import { cn } from "@/lib/utils";

export default function HowIBuild() {
  const [tab, setTab] = useState(0);
  const [selectedByDiagram, setSelectedByDiagram] = useState<Record<string, string>>({});
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const diagram = DIAGRAMS[tab];
  const selected = selectedByDiagram[diagram.id] ?? diagram.initial;
  const node = diagram.nodes.find((candidate) => candidate.id === selected) ?? diagram.nodes[0];
  const routes = diagram.routes.filter((route) => route.path.includes(node.id));
  const select = (id: string) => setSelectedByDiagram((current) => ({ ...current, [diagram.id]: id }));

  const onTabKey = (event: React.KeyboardEvent) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (step === 0) return;
    event.preventDefault();
    const next = (tab + step + DIAGRAMS.length) % DIAGRAMS.length;
    setTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <Section
      id="how-i-build"
      title="How I build"
      intro="Two systems I run in production, drawn the way a request sees them. Choose any part to see what it does and why it is there."
    >
      <div role="tablist" aria-label="Systems" className="flex gap-1 border-b border-border">
        {DIAGRAMS.map((candidate, index) => (
          <button
            key={candidate.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`tab-${candidate.id}`}
            aria-selected={index === tab}
            aria-controls="diagram-panel"
            tabIndex={index === tab ? 0 : -1}
            onClick={() => setTab(index)}
            onKeyDown={onTabKey}
            className={cn(
              "-mb-px border-b-2 border-transparent px-4 py-3 font-mono text-sm text-muted-foreground transition-colors duration-200 hover:text-accent",
              index === tab && "border-accent text-accent",
            )}
          >
            {candidate.name}
          </button>
        ))}
      </div>

      <div
        id="diagram-panel"
        role="tabpanel"
        aria-labelledby={`tab-${diagram.id}`}
        className="mt-6 grid items-start gap-6"
      >
        <div className="rounded-card border border-border bg-surface/50 p-3 sm:p-6">
          <p className="px-1 pb-4 text-[0.9375rem] text-muted-foreground sm:px-0">{diagram.summary}</p>
          <ArchitectureDiagram
            key={`${diagram.id}-wide`}
            diagram={diagram}
            layout="wide"
            selected={node.id}
            onSelect={select}
            className="hidden sm:block"
          />
          <ArchitectureDiagram
            key={`${diagram.id}-tall`}
            diagram={diagram}
            layout="tall"
            selected={node.id}
            onSelect={select}
            className="mx-auto max-w-sm sm:hidden"
          />
        </div>

        <aside aria-live="polite" className="rounded-card border border-border bg-surface p-6">
          <p className="font-mono text-xs text-accent">{routes.map((route) => route.label).join(" / ")}</p>
          <h3 className="mt-2 text-xl font-semibold text-foreground">{node.title}</h3>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">{node.body}</p>
          <ul className="mt-5 space-y-2 border-t border-border pt-4">
            {node.facts.map((fact) => (
              <li key={fact} className="font-mono text-[0.8125rem] text-foreground">
                {fact}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Section>
  );
}
