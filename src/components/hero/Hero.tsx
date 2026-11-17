import { buttonVariants } from "@/components/ui/Button";
import { SITE } from "@/config/site";
import { scrollToSection } from "@/lib/scroll";
import { cn } from "@/lib/utils";

const PHOTO_WIDTHS = [400, 640, 960];
export const HERO_PHOTO_SIZES = "(min-width: 1024px) 36rem, (min-width: 640px) 24rem, 78vw";

function srcSet(format: "avif" | "webp"): string {
  return PHOTO_WIDTHS.map((width) => `/images/rami-hero-${width}.${format} ${width}w`).join(", ");
}

export const HERO_PHOTO_SRCSET = srcSet("avif");

export default function Hero() {
  const go = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <section id="top" tabIndex={-1} className="relative overflow-clip outline-none">
      <div className="mx-auto grid max-w-wide items-end gap-x-8 px-5 pt-28 sm:px-8 sm:pt-32 lg:min-h-svh lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:pt-24 rail:px-28">
        <div className="pb-12 lg:self-center lg:py-16">
          <p className="font-mono text-sm text-accent sm:text-base">{SITE.location}</p>
          <h1 className="mt-5 text-display font-bold text-name">{SITE.name}</h1>
          <p className="mt-4 max-w-2xl text-lead font-semibold text-tagline">{SITE.tagline}</p>
          <p className="mt-7 max-w-xl text-base leading-relaxed text-dim sm:text-lg">{SITE.description}</p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#work" onClick={(event) => go(event, "work")} className={buttonVariants()}>
              View work
            </a>
            <a href="#contact" onClick={(event) => go(event, "contact")} className={buttonVariants()}>
              Contact me
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-[78vw] max-w-sm sm:max-w-md lg:mx-0 lg:mb-[6vh] lg:w-auto lg:max-w-none lg:self-center lg:justify-self-end">
          {/* Drawing-sheet grid and a soft glow sit behind the cut-out photo. */}
          <div
            aria-hidden="true"
            className={cn(
              "absolute -inset-x-16 -top-10 bottom-0",
              "bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]",
              "[mask-image:radial-gradient(closest-side,black_35%,transparent)]",
            )}
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[12%] bottom-0 rounded-full bg-glow opacity-60 blur-3xl"
          />
          <picture>
            <source type="image/avif" srcSet={srcSet("avif")} sizes={HERO_PHOTO_SIZES} />
            <source type="image/webp" srcSet={srcSet("webp")} sizes={HERO_PHOTO_SIZES} />
            <img
              src="/images/rami-hero-640.webp"
              alt="Rami Nasr, in a dark suit and white shirt"
              width={2000}
              height={2120}
              fetchPriority="high"
              decoding="sync"
              className="relative block h-auto w-full [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,black_80%,transparent),linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
            />
          </picture>
        </div>
      </div>
      <div aria-hidden="true" className="mx-auto h-px max-w-page bg-border" />
    </section>
  );
}
