import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import type { Route } from "./+types/Note";
import Footer from "@/components/layout/Footer";
import Monogram from "@/components/layout/Monogram";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { buttonVariants } from "@/components/ui/Button";
import { formatNoteDate, NOTES } from "@/config/notes";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";

const PROSE =
  "space-y-5 text-lg leading-relaxed text-muted-foreground [&_h2]:pt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_ol]:list-decimal [&_ol]:space-y-3 [&_ol]:pl-6 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-3 [&_ul]:pl-6";

function findNote(slug: string | undefined) {
  return NOTES.find((note) => note.slug === slug);
}

export function meta({ params }: Route.MetaArgs) {
  const note = findNote(params.slug);
  if (!note) return [{ title: `Note not found | ${SITE.name}` }, { name: "robots", content: "noindex" }];
  return [
    { title: `${note.title} | ${SITE.name}` },
    { name: "description", content: note.summary },
    { tagName: "link", rel: "canonical", href: `${SITE.url}/notes/${note.slug}` },
    { property: "og:title", content: note.title },
    { property: "og:description", content: note.summary },
    { property: "og:type", content: "article" },
    ...(note.draft ? [{ name: "robots", content: "noindex" }] : []),
  ];
}

export default function Note({ params }: Route.ComponentProps) {
  const note = findNote(params.slug);

  return (
    <>
      <header className="mx-auto flex h-20 max-w-3xl items-center justify-between px-5 sm:px-8">
        <Link to="/" aria-label={`${SITE.name}, home`} className="text-accent">
          <Monogram />
        </Link>
        <ThemeToggle />
      </header>
      <main className="mx-auto max-w-3xl px-5 pt-10 pb-24 sm:px-8">
        {note ? (
          <article>
            <p className="font-mono text-sm text-accent">
              {formatNoteDate(note.date)}
              {note.draft && " / Draft"}
            </p>
            <h1 className="mt-4 text-title font-semibold text-foreground">{note.title}</h1>
            <div className={cn("mt-10", PROSE)}>
              <note.Content />
            </div>
          </article>
        ) : (
          <>
            <h1 className="text-title font-semibold text-foreground">This note doesn't exist</h1>
            <p className="mt-3 text-lg text-muted-foreground">It may not be published yet.</p>
          </>
        )}
        <Link to="/#notes" className={buttonVariants({ size: "sm", className: "mt-14" })}>
          <ArrowLeft aria-hidden="true" />
          Back to the portfolio
        </Link>
      </main>
      <Footer />
    </>
  );
}
