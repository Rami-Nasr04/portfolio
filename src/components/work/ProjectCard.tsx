import { motion } from "motion/react";
import { Code2, Play } from "lucide-react";
import ProjectPreview, { EXPAND_TRANSITION } from "@/components/work/ProjectPreview";
import { Button, buttonVariants } from "@/components/ui/Button";
import type { Project, ProjectDemo } from "@/config/projects";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  /** Mirrors the layout on wide screens so consecutive studies alternate sides. */
  flipped?: boolean;
  eager?: boolean;
  onOpenDemo: (project: Project, demo: ProjectDemo) => void;
}

const CARD_RADIUS_PX = 14;

export default function ProjectCard({ project, flipped = false, eager = false, onOpenDemo }: ProjectCardProps) {
  const liveDemos = project.demos.filter((demo) => demo.url !== null);
  const pendingDemos = project.demos.filter((demo) => demo.url === null);
  const firstDemo = liveDemos[0];
  const headingId = `project-${project.id}`;

  return (
    <article
      aria-labelledby={headingId}
      className="grid items-start gap-x-12 gap-y-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
    >
      <div className={cn("relative lg:sticky lg:top-24", flipped && "lg:order-2")}>
        <motion.div
          layoutId={`window-${project.id}`}
          transition={EXPAND_TRANSITION}
          style={{ borderRadius: CARD_RADIUS_PX }}
          className="overflow-hidden border border-border bg-surface shadow-xl shadow-scrim/10"
        >
          <ProjectPreview project={project} eager={eager} />
        </motion.div>
        {firstDemo && (
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => onOpenDemo(project, firstDemo)}
            className="absolute inset-0 rounded-card"
          />
        )}
      </div>

      <div>
        <p className="font-mono text-sm text-muted-foreground">
          {project.period}
          <span className="mx-2 text-border-strong" aria-hidden="true">
            /
          </span>
          {project.role}
        </p>
        <h3 id={headingId} className="mt-2 text-title font-semibold">
          {project.name}
        </h3>
        <p className="mt-1 text-lg text-muted-foreground">{project.kind}</p>

        <dl className="mt-6 space-y-4 text-[0.9375rem] leading-relaxed">
          <div>
            <dt className="font-medium text-foreground">The problem</dt>
            <dd className="mt-1 text-muted-foreground">{project.problem}</dd>
          </div>
          <div>
            <dt className="font-medium text-foreground">What I built</dt>
            <dd className="mt-1 text-muted-foreground">{project.built}</dd>
          </div>
        </dl>

        <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-4 border-t border-border pt-5">
          {project.results.map((result) => (
            <div key={result.label} className="flex flex-col-reverse">
              <dt className="mt-1 max-w-40 text-sm text-muted-foreground">{result.label}</dt>
              <dd className="font-mono text-2xl font-medium tracking-tight text-foreground">{result.value}</dd>
            </div>
          ))}
        </dl>

        <ul aria-label="Stack" className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>

        {(project.demos.length > 0 || project.code.length > 0) && (
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {liveDemos.map((demo, index) => (
              <Button
                key={demo.key}
                variant={index === 0 ? "primary" : "outline"}
                onClick={() => onOpenDemo(project, demo)}
              >
                <Play aria-hidden="true" />
                Live demo{project.demos.length > 1 && `: ${demo.label.toLowerCase()}`}
              </Button>
            ))}
            {project.code.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={buttonVariants({ variant: "outline" })}
              >
                <Code2 aria-hidden="true" />
                {project.code.length > 1 ? `${link.label} code` : "Code"}
              </a>
            ))}
            {pendingDemos.map((demo) => (
              <span key={demo.key} className="font-mono text-xs text-muted-foreground">
                {demo.label} demo in preparation
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
