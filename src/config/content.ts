/** Copy for About, Experience and Skills. Every fact comes from the CV. */

export const ABOUT_PARAGRAPHS: string[] = [
  "I'm a full-stack developer in Beirut who builds production web systems end to end and stays with them after launch: TypeScript serverless backends on AWS, PostgreSQL and MySQL data models, authentication, and React frontends.",
  "As the sole engineer, I built the reservation and floor-management platform that Sushi Tsunami, a fine-dining restaurant in Achrafieh, runs its service on every day. I also built Glowstone, a live e-commerce store with its own admin studio that the owner runs from a phone.",
  "What I care about: data that can't go wrong (transactions, row locking, idempotent APIs), security by default (MFA, role-based access, parameterized SQL), and fixing real incidents. After a production incident I load-tested the restaurant platform at about ten times its rush-hour traffic, found database connection exhaustion, fixed it across three layers, and re-tested to zero errors.",
  "Before this, I spent 14 months doing remote IT, network and application support for branches across Lebanon, Africa and Saudi Arabia.",
];

export interface Fact {
  label: string;
  value: string;
}

export const ABOUT_FACTS: Fact[] = [
  { label: "Based in", value: "Beirut, Lebanon" },
  { label: "Open to", value: "Full-stack, backend and cloud/DevOps roles, remote or on-site, and freelance projects" },
  { label: "Languages", value: "Arabic (native), English (fluent)" },
  { label: "Day to day", value: "TypeScript, React, Node.js, AWS, PostgreSQL" },
];

/** Set to the certificate's name to show the "Currently learning" badge in About. */
export const CURRENTLY_LEARNING: string | null = null;

export interface ExperienceEntry {
  period: string;
  role: string;
  place: string;
  points: string[];
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    period: "2026 to present",
    role: "Freelance Full-Stack Developer",
    place: "Independent practice, Beirut",
    points: [
      "Glowstone (Sep 2026 to present): a live e-commerce store and admin studio on a serverless TypeScript backend on AWS, built as sole engineer.",
      "Sushi Tsunami, Achrafieh (May 2026 to present): the reservation and floor-management platform the restaurant's staff use daily, built, shipped and maintained as sole engineer.",
      "Also delivered Arome Gourmet, a bilingual English and Arabic marketing MVP, and the Ayssar Tarabay tattoo-artist portfolio, both on the agreed timelines.",
    ],
  },
  {
    period: "Feb 2023 to Apr 2024",
    role: "IT & Network Support / Application Support",
    place: "Virus Gaming Center & Store, remote from Beirut",
    points: [
      "Remotely administered network infrastructure for branches across Lebanon, Africa and Saudi Arabia, keeping sites connected, monitored and secure.",
      "Supported the company's business mobile app through feature testing, issue reproduction and QA feedback, coordinating between operations and the development team through each release.",
      "Administered the internal business systems used across branches and resolved hardware, software and connectivity issues where downtime cost trading hours.",
    ],
  },
];

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
  detail?: string;
}

/** Degrees and certificates, newest first. Add new ones at the top. */
export const CERTIFICATES: Certificate[] = [
  {
    name: "BSc, Computer Science",
    issuer: "Lebanese American University, Beirut",
    date: "Dec 2025",
    detail:
      "Coursework: Web Development (PHP, MySQL), Software Engineering, Database Management Systems, Cloud Computing. Capstone: Wasselni, a ride-sharing, fleet and route-tracking platform built in a two-person team.",
  },
];

export interface SkillGroup {
  name: string;
  skills: string[];
}

export const SKILLS: SkillGroup[] = [
  { name: "Languages", skills: ["TypeScript", "JavaScript", "SQL", "PHP", "HTML/CSS"] },
  {
    name: "Backend",
    skills: [
      "Node.js",
      "REST API design",
      "MVC / layered architecture",
      "Request validation (Zod)",
      "RBAC and JWT auth",
      "Idempotent APIs",
      "Serverless Framework v4",
    ],
  },
  {
    name: "Databases",
    skills: [
      "PostgreSQL",
      "MySQL",
      "Normalized schema design",
      "Complex joins (inner, left, lateral)",
      "Indexing and query optimization",
      "Transactions and row-level locking",
      "Versioned migrations",
      "Connection pooling",
    ],
  },
  {
    name: "Frontend",
    skills: [
      "React 19",
      "React Router (prerendering)",
      "Vite",
      "Tailwind CSS",
      "Radix UI / shadcn/ui",
      "Motion",
      "Responsive and accessible UI",
      "Technical SEO",
      "i18n / RTL",
    ],
  },
  {
    name: "Cloud & DevOps",
    skills: [
      "AWS Lambda",
      "API Gateway",
      "Cognito",
      "RDS",
      "VPC",
      "S3",
      "CloudFront",
      "SES",
      "CloudWatch",
      "Vercel",
      "DKIM / DMARC",
      "CI/CD",
      "Git & GitHub",
    ],
  },
  {
    name: "Practices",
    skills: [
      "Production debugging",
      "Performance tuning",
      "Load testing",
      "Automated testing (Vitest, Testing Library)",
      "Monitoring and alerting",
      "Technical documentation",
      "Secure coding",
    ],
  },
];
