export interface Job {
  company: string;
  role: string;
  period: string;
  location: string;
  tech: string[];
  bullets: string[];
}

export const experience: Job[] = [
  {
    company: "IGS Energy",
    role: "Software Developer (Intern)",
    period: "May 2026 – Present",
    location: "Dublin, OH",
    tech: [
      "C#",
      ".NET",
      "React",
      "TypeScript",
      "Python/FastAPI",
      "SSMS",
      "Azure DevOps",
      "Playwright",
      "Octopus",
      "HubSpot",
    ],
    bullets: [
      "Delivered full-stack features for Choice 360, IGS Energy's core customer CRM, spanning a React 18/TypeScript frontend, ASP.NET Core 10 backend, and SQL Server migration repo with coordinated branching and deploy ordering.",
      "Built a contract parser at a company hackathon after learning from a director that signed contracts were never recorded, extracting fields into a database that can be cross checked against upstream systems, then pitched it to leadership.",
      "Built interactive dashboards from Jira and Octopus Deploy history that gave the team visibility into its own support load and release cadence, surfacing where ticket volume was avoidable and how much of the release cycle was unplanned.",
      "Removed 5,100+ lines of dead legacy code across two systems, an abandoned HubSpot contact-sync subsystem and a retired feature-flag path, sequencing flag deletion across two application deployments so legacy paths couldn't reactivate.",
    ],
  },
  {
    company: "Emerson",
    role: "Software Developer (Co-op)",
    period: "Jan 2026 – Apr 2026",
    location: "Elyria, OH",
    tech: ["C#", ".NET", "Vue.js", "SQL Server", "Azure", "Git"],
    bullets: [
      "Developed full-stack features and production fixes for an internal enterprise CRM serving 5,000+ employees, implementing backend business logic, SQL schema updates, stored procedures, and Entity Framework migration.",
      "Automated customer feedback notifications and inactive case archival via batch processes and scheduled jobs, maintaining database hygiene and reducing manual overhead through code-first migrations and SQL table management",
    ],
  },
  {
    company: "Emerson",
    role: "System Analyst (Co-op)",
    period: "Jan 2026 – Apr 2026",
    location: "Elyria, OH",
    tech: [],
    bullets: [
      "Led end-to-end discovery for a CRM enhancement project, replacing spreadsheet-based promo tracking with structured case fields that cut redemption processing time by nearly 50% for a team of 12+ customer representatives",
      "Defined data architecture, wrote developer cards, and migrated legacy data into normalized relational tables, structuring output for VP-level DOMO dashboards tracking hundreds of monthly promotions and tool trade-ins.",
    ],
  },
  {
    company: "Parcel",
    role: "Co-Founder",
    period: "Aug 2025 – Nov 2025",
    location: "Columbus, OH",
    tech: ["Node.js", "TypeScript"],
    bullets: [
      "Placed top 6 of 50+ teams and secured $5,000 in funding through OSU's Best of Student Startups accelerator.",
      "Built a web-based workflow application enabling adjusters to centralize documentation, auto-generate templates, and share complete claim packets in one click, improving speed, reducing reporting errors, and streamlining field workflows.",
      "Led customer discovery with insurance adjusters to validate workflow inefficiencies and define product requirements.",
    ],
  },
  {
    company: "Aeigis",
    role: "Co-Founder",
    period: "Jan 2025 – Mar 2025",
    location: "Columbus, OH",
    tech: ["Node.js", "TypeScript", "C#"],
    bullets: [
      "Selected as finalist (top 11 of 60) in OSU’s President’s Buckeye Accelerator for a firefighter safety tracking solution.",
      "Led discovery and validation by interviewing 12+ Firefighters; securing letters of intent from two fire departments.",
      "Coordinated development of a prototype and pitch deck, presenting to investors to support funding and deployment.",
    ],
  },
  {
    company: "Patel Family Enterprises",
    role: "Owner/Operations Manager",
    period: "Jan 2019 – Present",
    location: "Parma, OH",
    tech: [],
    bullets: [
      "Oversee daily operations across 3 family-owned franchise and retail businesses generating $1.5M+ in combined annual revenue, managing 20+ employees across scheduling, vendor relations, POS systems, and inventory management",
    ],
  },
];

export interface Project {
  name: string;
  tech: string[];
  date: string;
  description: string;
  link?: string | null;
  youtube?: string;
}

export const projects: Project[] = [
  {
    name: "2D Zelda Style Game",
    tech: ["C#", "MonoGame", "C", "Arduino", "ESP32"],
    date: "Dec 2025",
    description:
      "A fully playable recreation of the first Legend of Zelda dungeon built in a 5-person agile team using Jira and Git. Implemented HUD systems, map/mini-map rendering, and sprite-based gameplay mechanics. Also built a physical ESP32 controller in Arduino/C for real-time serial input.",
    link: "https://github.com/LiamG5/sprint0",
    youtube: "https://youtu.be/J4wWH2GWCQ4",
  },
  {
    name: "Systems Programming Coursework",
    tech: ["C", "x86-64 Assembly", "GDB"],
    date: "Jan 2025",
    description:
      "Built multi-file C programs processing structured records using file I/O and structs. Debugged low-level behavior with GDB while applying x86-64 calling conventions and stack alignment.",
    link: null,
  },
];
