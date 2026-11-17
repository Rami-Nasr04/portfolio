import { useCallback, useState } from "react";
import { AnimatePresence } from "motion/react";
import ProjectCard from "@/components/work/ProjectCard";
import ProjectWindow from "@/components/work/ProjectWindow";
import { PROJECTS, type Project, type ProjectDemo } from "@/config/projects";

interface OpenDemo {
  project: Project;
  demo: ProjectDemo;
}

interface SelectedWorkProps {
  /** Limits how many case studies render. Used while the page is being built up. */
  limit?: number;
}

export default function SelectedWork({ limit = PROJECTS.length }: SelectedWorkProps) {
  const [open, setOpen] = useState<OpenDemo | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <section id="work" tabIndex={-1} aria-labelledby="work-title" className="outline-none">
      <div className="mx-auto max-w-page px-5 py-16 sm:px-8 sm:py-20 rail:px-24">
        <h2 id="work-title" className="text-title font-semibold">
          Selected work
        </h2>
        <p className="mt-3 max-w-xl text-lg text-muted-foreground">
          Systems I designed, built and still run for clients. Open a live demo and it loads right here.
        </p>

        <div className="mt-14 space-y-24 sm:mt-16 sm:space-y-32">
          {PROJECTS.slice(0, limit).map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              flipped={index % 2 === 1}
              onOpenDemo={(openProject, demo) => setOpen({ project: openProject, demo })}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <ProjectWindow
            key={`${open.project.id}-${open.demo.key}`}
            project={open.project}
            demo={open.demo}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
