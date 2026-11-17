/** One place for everything that changes when the domain or contact details change. */
export const SITE = {
  /** Change this single value when the custom domain is bought. */
  url: "https://rami-nasr.vercel.app",
  name: "Rami Nasr",
  title: "Full-Stack Developer, Backend, Cloud & Databases",
  valueLine:
    "I build and run production web systems for real businesses, end to end, and stay with them after launch.",
  location: "Beirut, Lebanon",
  email: "rami.nasrr04@gmail.com",
  whatsappNumber: "96176758006",
  linkedin: "https://www.linkedin.com/in/rami-nasr-dev",
  github: "https://github.com/Rami-Nasr04",
  cvPath: "/Rami-Nasr-CV.pdf",
} as const;

export interface NavSection {
  id: string;
  label: string;
}

export const NAV_SECTIONS: NavSection[] = [
  { id: "work", label: "Work" },
  { id: "how-i-build", label: "How I build" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "services", label: "Services" },
  { id: "notes", label: "Notes" },
  { id: "contact", label: "Contact" },
];
