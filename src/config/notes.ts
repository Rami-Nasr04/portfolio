import type { ComponentType } from "react";

export interface NoteMeta {
  title: string;
  /** ISO date, e.g. 2026-11-17. */
  date: string;
  summary: string;
  /** Drafts show only on the local dev server, never in a production build. */
  draft: boolean;
}

export interface Note extends NoteMeta {
  slug: string;
  Content: ComponentType;
}

interface NoteModule {
  default: ComponentType;
  meta: NoteMeta;
}

const modules = import.meta.glob<NoteModule>("../notes/*.mdx", { eager: true });

/** Every note in src/notes, newest first. To add one, drop in a new .mdx file. */
export const NOTES: Note[] = Object.entries(modules)
  .map(([path, module]) => ({
    ...module.meta,
    slug: path.replace(/^.*\/(.+)\.mdx$/, "$1"),
    Content: module.default,
  }))
  .filter((note) => import.meta.env.DEV || !note.draft)
  .sort((a, b) => b.date.localeCompare(a.date));

export function formatNoteDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
