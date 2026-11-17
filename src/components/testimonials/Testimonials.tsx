import Section from "@/components/layout/Section";
import testimonials from "@/config/testimonials.json";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  business: string;
}

/** Real quotes only. Add them to testimonials.json; with none, the section does not render. */
const TESTIMONIALS: Testimonial[] = testimonials;

export default function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <Section id="testimonials" title="What clients say">
      <ul className="grid gap-5 md:grid-cols-2">
        {TESTIMONIALS.map((testimonial) => (
          <li key={testimonial.name} className="rounded-card border border-border bg-surface p-7">
            <figure>
              <blockquote className="text-lg leading-relaxed text-foreground">{testimonial.quote}</blockquote>
              <figcaption className="mt-5 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{testimonial.name}</span>, {testimonial.role},{" "}
                {testimonial.business}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}
