import Section from "@/components/layout/Section";
import { CERTIFICATES } from "@/config/content";

export default function Certificates() {
  return (
    <Section id="certificates" title="Certificates">
      <ul className="divide-y divide-border border-y border-border">
        {CERTIFICATES.map((certificate) => (
          <li key={certificate.name} className="grid gap-x-8 gap-y-2 py-6 sm:grid-cols-[11rem_minmax(0,1fr)]">
            <p className="pt-1 font-mono text-sm text-accent">{certificate.date}</p>
            <div>
              <h3 className="text-xl font-semibold text-foreground">{certificate.name}</h3>
              <p className="mt-1 text-muted-foreground">{certificate.issuer}</p>
              {certificate.detail && (
                <p className="mt-3 max-w-3xl text-[0.9375rem] leading-relaxed text-muted-foreground">
                  {certificate.detail}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
