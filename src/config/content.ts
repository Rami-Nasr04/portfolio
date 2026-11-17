/** Copy for About, Experience and Skills. Every fact comes from the CV. */

export const ABOUT_PARAGRAPHS: string[] = [
  "I'm a full-stack developer in Beirut who builds production web systems end to end and stays with them after launch: TypeScript serverless backends on AWS, PostgreSQL and MySQL data models, authentication, and React frontends.",
  "As the sole engineer, I built the reservation and floor-management platform that Sushi Tsunami, a fine-dining restaurant in Achrafieh, runs its service on every day. I also built Glowstone, a live e-commerce store with its own admin studio.",
  "What I care about: data that can't go wrong (transactions, row locking, idempotent APIs), security by default (MFA, role-based access, parameterized SQL), and fixing real incidents. During a peak-hour outage I traced the cause to database connection exhaustion, fixed it across three layers, and load-tested it to zero errors.",
  "Before this, I spent 14 months doing remote IT, network and application support for branches across Lebanon, Africa and Saudi Arabia. I hold a BSc in Computer Science from the Lebanese American University, and I work in Arabic and English.",
];

export interface Stat {
  value: string;
  label: string;
}

export const ABOUT_STATS: Stat[] = [
  { value: "1,800+", label: "automated tests behind Glowstone" },
  { value: "100", label: "Lighthouse SEO and accessibility, Glowstone" },
  { value: "35", label: "REST endpoints in the Sushi Tsunami platform" },
  { value: "0", label: "errors in the load test after the incident fix" },
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
  {
    period: "Dec 2025",
    role: "BSc, Computer Science",
    place: "Lebanese American University, Beirut",
    points: [
      "Coursework: Web Development (PHP, MySQL), Software Engineering, Database Management Systems, Cloud Computing.",
      "Capstone: Wasselni, a ride-sharing, fleet and route-tracking platform built in a two-person team.",
    ],
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
