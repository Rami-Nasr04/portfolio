/** "Ice-skating" section navigation: a long ease-out glide that any user input cancels. */

const MIN_DURATION_MS = 900;
const MAX_DURATION_MS = 1200;
const HEADER_OFFSET_PX = 72;
const CANCEL_EVENTS = ["wheel", "touchstart", "keydown", "mousedown"] as const;

let frame = 0;

function easeOutQuint(t: number): number {
  return 1 - (1 - t) ** 5;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollToSection(id: string): void {
  const target = document.getElementById(id);
  if (!target) return;

  const start = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const end = Math.max(
    0,
    Math.min(maxScroll, target.getBoundingClientRect().top + start - HEADER_OFFSET_PX),
  );

  history.replaceState(null, "", `#${id}`);
  const moveFocus = () => target.focus({ preventScroll: true });

  if (prefersReducedMotion()) {
    window.scrollTo(0, end);
    moveFocus();
    return;
  }

  cancelAnimationFrame(frame);
  const distance = Math.abs(end - start);
  const duration = Math.min(MAX_DURATION_MS, MIN_DURATION_MS + distance / 20);
  const startedAt = performance.now();

  const stop = () => {
    cancelAnimationFrame(frame);
    CANCEL_EVENTS.forEach((name) => window.removeEventListener(name, stop));
  };
  CANCEL_EVENTS.forEach((name) => window.addEventListener(name, stop, { passive: true, once: true }));

  const step = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    window.scrollTo(0, start + (end - start) * easeOutQuint(progress));
    if (progress < 1) {
      frame = requestAnimationFrame(step);
    } else {
      stop();
      moveFocus();
    }
  };
  frame = requestAnimationFrame(step);
}
