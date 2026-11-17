import { Link } from "react-router";
import Section from "@/components/layout/Section";
import { formatNoteDate, NOTES } from "@/config/notes";

/** Renders nothing until at least one note is published. */
export default function Notes() {
  if (NOTES.length === 0) return null;

  return (
    <Section id="notes" title="Notes" intro="Write-ups of real problems from the systems I run.">
      <ul className="divide-y divide-border border-y border-border">
        {NOTES.map((note) => (
          <li key={note.slug}>
            <Link to={`/notes/${note.slug}`} className="group block py-7">
              <p className="font-mono text-xs text-muted-foreground">
                {formatNoteDate(note.date)}
                {note.draft && <span className="ml-3 text-accent">Draft, visible on the dev server only</span>}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-foreground transition-colors duration-200 group-hover:text-accent">
                {note.title}
              </h3>
              <p className="mt-2 max-w-2xl text-muted-foreground">{note.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
