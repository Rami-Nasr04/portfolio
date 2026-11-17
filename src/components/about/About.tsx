import Section from "@/components/layout/Section";
import { ABOUT_PARAGRAPHS, ABOUT_STATS, CURRENTLY_LEARNING } from "@/config/content";

const PHOTO_WIDTHS = [400, 640, 960];
const PHOTO_SIZES = "(min-width: 1024px) 22rem, 70vw";

function srcSet(format: "avif" | "webp"): string {
  return PHOTO_WIDTHS.map((width) => `/images/rami-about-${width}.${format} ${width}w`).join(", ");
}

export default function About() {
  return (
    <Section id="about" title="About">
      <div className="grid items-start gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div>
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-muted-foreground">
            {ABOUT_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {CURRENTLY_LEARNING && (
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 font-mono text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              Currently learning: {CURRENTLY_LEARNING}
            </p>
          )}
        </div>

        <div className="relative mx-auto w-[70vw] max-w-xs lg:mx-0 lg:w-auto lg:max-w-none">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-[10%] bottom-0 rounded-full bg-glow opacity-50 blur-3xl"
          />
          <picture>
            <source type="image/avif" srcSet={srcSet("avif")} sizes={PHOTO_SIZES} />
            <source type="image/webp" srcSet={srcSet("webp")} sizes={PHOTO_SIZES} />
            <img
              src="/images/rami-about-640.webp"
              alt="Rami Nasr with his arms crossed"
              loading="lazy"
              decoding="async"
              className="relative block h-auto w-full [mask-image:linear-gradient(to_bottom,black_82%,transparent)]"
            />
          </picture>
        </div>
      </div>

      <dl className="mt-14 grid gap-px overflow-hidden rounded-card border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {ABOUT_STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse bg-surface p-6">
            <dt className="mt-2 text-sm text-muted-foreground">{stat.label}</dt>
            <dd className="font-mono text-3xl font-bold tracking-tight text-foreground">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
