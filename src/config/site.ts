/** One place for everything that changes when the domain or contact details change. */
export const SITE = {
  /** Placeholder. Change this single value when the real URL or custom domain exists. */
  url: "https://rami-nasr.vercel.app",
  name: "Rami Nasr",
  title: "Full-Stack Developer, Backend, Cloud & Databases",
  tagline: "I take ideas from sketch to production, and keep them running.",
  description:
    "Full-stack developer focused on backend, cloud and databases. I build and run production systems for real businesses, end to end.",
  location: "Beirut, Lebanon",
  email: "rami.nasrr04@gmail.com",
  whatsappNumber: "96176758006",
  linkedin: "https://www.linkedin.com/in/rami-nasr-dev",
  github: "https://github.com/Rami-Nasr04",
  cvPath: "/Rami-Nasr-CV.pdf",
} as const;

export const WHATSAPP_URL = `https://wa.me/${SITE.whatsappNumber}`;

export interface NavSection {
  id: string;
  label: string;
}

/** The numbered links in the nav bar. The other sections are reached by scrolling. */
export const NAV_SECTIONS: NavSection[] = [
  { id: "work", label: "Work" },
  { id: "how-i-build", label: "How I Build" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];
