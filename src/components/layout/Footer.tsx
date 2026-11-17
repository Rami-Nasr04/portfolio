import ThemeToggle from "@/components/layout/ThemeToggle";
import { SITE } from "@/config/site";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-page flex-wrap items-center justify-between gap-x-8 gap-y-4 px-5 py-8 sm:px-8 rail:px-24">
        <div>
          <p className="text-foreground">{SITE.tagline}</p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SITE.name}. Built with React + TypeScript.
          </p>
        </div>
        <ThemeToggle />
      </div>
    </footer>
  );
}
