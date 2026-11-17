import { Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { SITE } from "@/config/site";
import { scrollToSection } from "@/lib/scroll";
import { cn } from "@/lib/utils";

const PHOTO_WIDTHS = [400, 640, 960];
const PHOTO_SIZES = "(min-width: 1024px) 30rem, (min-width: 640px) 24rem, 78vw";

function srcSet(format: "avif" | "webp"): string {
  return PHOTO_WIDTHS.map((width) => `/images/rami-hero-${width}.${format} ${width}w`).join(", ");
}

export default function Hero() {
  const go = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    scrollToSection(id);
  };

  return (
    <section id="top" tabIndex={-1} className="relative overflow-clip outline-none">
      <div className="mx-auto grid max-w-page items-end gap-x-10 px-5 pt-10 sm:px-8 sm:pt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:pt-20">
        <div className="pb-10 lg:pb-28">
          <p className="font-mono text-sm text-primary">{SITE.location}</p>
          <h1 className="mt-4 text-display font-semibold">{SITE.name}</h1>
          <p className="mt-5 max-w-xl text-xl font-medium text-foreground sm:text-2xl">{SITE.title}</p>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">{SITE.valueLine}</p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#work" onClick={(event) => go(event, "work")} className={buttonVariants({ variant: "primary" })}>
              View work
            </a>
            <a
              href="#contact"
              onClick={(event) => go(event, "contact")}
              className={buttonVariants({ variant: "accent" })}
            >
              Contact me
            </a>
            <a
              href={SITE.cvPath}
              download
              className="ml-1 inline-flex items-center gap-2 py-2 text-sm text-muted-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:text-foreground"
            >
              <Download className="size-4" aria-hidden="true" />
              Download CV
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-[78vw] max-w-sm sm:max-w-md lg:mx-0 lg:w-auto lg:max-w-none lg:justify-self-end">
          {/* Drawing-sheet grid and a soft navy glow sit behind the cut-out photo. */}
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
            className="absolute inset-x-0 top-[12%] bottom-0 rounded-full bg-glow opacity-50 blur-3xl"
          />
          <picture>
            <source type="image/avif" srcSet={srcSet("avif")} sizes={PHOTO_SIZES} />
            <source type="image/webp" srcSet={srcSet("webp")} sizes={PHOTO_SIZES} />
            <img
              src="/images/rami-hero-640.webp"
              alt="Rami Nasr, in a dark suit and white shirt"
              width={2000}
              height={2120}
              fetchPriority="high"
              decoding="async"
              className="relative block h-auto w-full [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,black_80%,transparent),linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
            />
          </picture>
        </div>
      </div>
      <div aria-hidden="true" className="mx-auto h-px max-w-page bg-border" />
    </section>
  );
}
