import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import Monogram from "@/components/layout/Monogram";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { buttonVariants, ICON_CONTROL } from "@/components/ui/Button";
import { NAV_SECTIONS, SITE } from "@/config/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { scrollToSection } from "@/lib/scroll";
import { cn } from "@/lib/utils";

const SECTION_IDS = NAV_SECTIONS.map((section) => section.id);
const SCROLLED_AFTER_PX = 8;
/** The bar only hides once the page has moved past it, and ignores tiny scroll jitters. */
const HIDE_AFTER_PX = 96;
const DIRECTION_THRESHOLD_PX = 6;
const SCROLL_LOCK_CLASS = "scroll-locked";

const BAR_VARIANTS = {
  shown: { y: 0 },
  hidden: { y: "-100%" },
};
const BAR_TRANSITION = { duration: 0.3, ease: [0.16, 1, 0.3, 1] } as const;
const PANEL_VARIANTS = {
  closed: { x: "100%" },
  open: { x: 0 },
};
const SCRIM_VARIANTS = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};
const PANEL_TRANSITION = { duration: 0.35, ease: [0.16, 1, 0.3, 1] } as const;

function number(index: number): string {
  return `${String(index + 1).padStart(2, "0")}.`;
}

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > SCROLLED_AFTER_PX);
      if (Math.abs(y - last) < DIRECTION_THRESHOLD_PX) return;
      setHidden(y > last && y > HIDE_AFTER_PX);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the panel is open: Esc closes it, the page behind cannot scroll or take focus.
  useEffect(() => {
    if (!menuOpen) return;
    const menuButton = menuButtonRef.current;
    const main = document.querySelector("main");
    main?.setAttribute("inert", "");
    document.documentElement.classList.add(SCROLL_LOCK_CLASS);
    closeRef.current?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      main?.removeAttribute("inert");
      document.documentElement.classList.remove(SCROLL_LOCK_CLASS);
      menuButton?.focus({ preventScroll: true });
    };
  }, [menuOpen]);

  const go = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <>
      <motion.header
        variants={BAR_VARIANTS}
        initial={false}
        animate={hidden && !menuOpen ? "hidden" : "shown"}
        transition={BAR_TRANSITION}
        onFocusCapture={() => setHidden(false)}
        className={cn(
          "fixed inset-x-0 top-0 z-40 bg-surface/80 backdrop-blur-md transition-shadow duration-300",
          scrolled && "shadow-lg shadow-scrim/25",
        )}
      >
        <nav
          aria-label="Main"
          className={cn(
            "flex h-20 items-center px-5 transition-[height] duration-300 ease-glide sm:px-8 lg:px-12",
            scrolled && "h-16",
          )}
        >
          <a
            href="#top"
            onClick={(event) => go(event, "top")}
            aria-label={`${SITE.name}, back to top`}
            className="mr-auto block text-accent"
          >
            <span id="nav-logo" className="block">
              <Monogram />
            </span>
          </a>

          <ol className="hidden items-center lg:flex">
            {NAV_SECTIONS.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={(event) => go(event, section.id)}
                  aria-current={active === section.id ? "true" : undefined}
                  className={cn(
                    "block px-3.5 py-2 font-mono text-[0.8125rem] text-foreground transition-colors duration-200 hover:text-accent",
                    active === section.id && "text-accent",
                  )}
                >
                  <span className="mr-1.5 text-accent">{number(index)}</span>
                  {section.label}
                </a>
              </li>
            ))}
          </ol>

          <a
            href={SITE.cvPath}
            target="_blank"
            rel="noreferrer"
            className={cn(buttonVariants({ size: "sm" }), "ml-3 hidden sm:inline-flex")}
          >
            Resume
          </a>
          <ThemeToggle className="ml-2" />
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className={cn(ICON_CONTROL, "-mr-2 text-accent lg:hidden")}
          >
            <Menu />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <div id="mobile-menu" className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              variants={SCRIM_VARIANTS}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
              className="absolute inset-0 bg-scrim/60 backdrop-blur-xs"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              variants={PANEL_VARIANTS}
              initial="closed"
              animate="open"
              exit="closed"
              transition={PANEL_TRANSITION}
              className="absolute inset-y-0 right-0 flex w-[min(78vw,22rem)] flex-col bg-surface-raised px-8 pt-5 pb-10 shadow-2xl shadow-scrim/40"
            >
              <button
                ref={closeRef}
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className={cn(ICON_CONTROL, "-mr-3 self-end text-accent")}
              >
                <X />
              </button>

              <ol className="my-auto space-y-7 text-center">
                {NAV_SECTIONS.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      onClick={(event) => go(event, section.id)}
                      className={cn(
                        "block font-mono text-lg text-foreground transition-colors hover:text-accent",
                        active === section.id && "text-accent",
                      )}
                    >
                      <span className="mb-1 block text-sm text-accent">{number(index)}</span>
                      {section.label}
                    </a>
                  </li>
                ))}
              </ol>

              <a
                href={SITE.cvPath}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants(), "self-center px-12")}
              >
                Resume
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
