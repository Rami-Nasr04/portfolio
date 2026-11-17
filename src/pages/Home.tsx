import { lazy, Suspense } from "react";
import Hero, { HERO_PHOTO_SIZES, HERO_PHOTO_SRCSET } from "@/components/hero/Hero";
import Footer from "@/components/layout/Footer";
import MonogramIntro from "@/components/layout/MonogramIntro";
import Nav from "@/components/layout/Nav";
import SideRails from "@/components/layout/SideRails";
import SelectedWork from "@/components/work/SelectedWork";
import { SITE } from "@/config/site";

const BelowFold = lazy(() => import("@/components/layout/BelowFold"));

const PAGE_TITLE = `${SITE.name} | ${SITE.title}`;
const OG_IMAGE = `${SITE.url}/og.png`;

const PERSON_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: SITE.name,
  url: SITE.url,
  image: OG_IMAGE,
  jobTitle: "Full-Stack Developer",
  description: SITE.description,
  email: `mailto:${SITE.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Beirut", addressCountry: "LB" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Lebanese American University" },
  knowsLanguage: ["Arabic", "English"],
  sameAs: [SITE.linkedin, SITE.github],
});

/** The hero photo is the largest paint on phones, so the browser is told about it up front. */
export function links() {
  return [
    {
      rel: "preload",
      as: "image",
      type: "image/avif",
      href: "/images/rami-hero-640.avif",
      imageSrcSet: HERO_PHOTO_SRCSET,
      imageSizes: HERO_PHOTO_SIZES,
      fetchPriority: "high",
    },
  ];
}

export function meta() {
  return [
    { title: PAGE_TITLE },
    { name: "description", content: SITE.description },
    { tagName: "link", rel: "canonical", href: SITE.url },
    { property: "og:type", content: "website" },
    { property: "og:url", content: SITE.url },
    { property: "og:title", content: PAGE_TITLE },
    { property: "og:description", content: SITE.description },
    { property: "og:image", content: OG_IMAGE },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: PERSON_JSON_LD }} />
      <MonogramIntro />
      <div id="page">
        <Nav />
        <SideRails />
        <main>
          <Hero />
          <SelectedWork />
          <Suspense fallback={null}>
            <BelowFold />
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}
