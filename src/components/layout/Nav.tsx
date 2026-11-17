import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Monogram from "@/components/layout/Monogram";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { NAV_SECTIONS, SITE } from "@/config/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { scrollToSection } from "@/lib/scroll";
import { cn } from "@/lib/utils";

const SECTION_IDS = NAV_SECTIONS.map((section) => section.id);
const SCROLLED_AFTER_PX = 8;

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLLED_AFTER_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const go = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-transparent transition-[background-color,border-color] duration-300",
        (scrolled || menuOpen) && "border-border bg-background/85 backdrop-blur-md",
      )}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-page items-center gap-2 px-5 sm:px-8">
        <a
          href="#top"
          onClick={(event) => go(event, "top")}
          aria-label={`${SITE.name}, back to top`}
          className="-ml-1 mr-auto flex items-center p-1 text-foreground transition-colors hover:text-primary"
        >
          <span id="nav-logo" className="block">
            <Monogram />
          </span>
        </a>

        <ul className="hidden items-center lg:flex">
          {NAV_SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(event) => go(event, section.id)}
                aria-current={active === section.id ? "true" : undefined}
                className={cn(
                  "block px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                  active === section.id && "text-foreground",
                )}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>

        <ThemeToggle className="lg:ml-2" />
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X /> : <Menu />}
        </Button>
      </nav>

      <div id="mobile-menu" hidden={!menuOpen} className="border-t border-border lg:hidden">
        <ul className="mx-auto max-w-page px-5 py-3 sm:px-8">
          {NAV_SECTIONS.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                onClick={(event) => go(event, section.id)}
                className={cn(
                  "block py-3 text-lg text-muted-foreground",
                  active === section.id && "text-foreground",
                )}
              >
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
