export const experience = [
   {
  company: "IGS Energy",
    role: "Software Developer (Intern)",
    period: "May 2026 – Present",
    location: "Dublin, OH",
    tech: ["C#", ".NET", "Vue.js", "SQL Server", "Azure"],
    bullets: [
      "Contributed to Choice 360, IGS Energy's core CRM platform used by hundreds of sales reps and customer service agents, resolving production bugs and investigating HubSpot data flows to support an active acquisition with Scana Energy.",
      "Validated a local Playwright E2E testing framework enabling developers to target local, INT, or QA environments with selective test runs, and documented the full setup in Confluence for team-wide adoption.",
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
      "Finalist (top 6 of 50+ teams) and $5,000 funding recipient in OSU's Best of Student Startups accelerator.",
      "Built a web-based workflow application enabling insurance adjusters to centralize documentation, auto-generate templates, and share complete claim packets in one click.",
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
    role: "Manager",
    period: "Jan 2019 – Dec 2025",
    location: "Parma, OH",
    tech: [],
    bullets: [
      "Oversee daily operations across 3 family-owned franchise and retail businesses generating $1.5M+ in combined annual revenue, managing 20+ employees across scheduling, vendor relations, POS systems, and inventory management",
    ],
  },
];

export const projects = [
  {
    name: "2D Zelda Style Game",
    tech: ["C#", "MonoGame", "C", "Arduino", "ESP32"],
    date: "Dec 2025",
    description:
      "A fully playable recreation of the first Legend of Zelda dungeon built in a 5-person agile team using Jira and Git. Implemented HUD systems, map/mini-map rendering, and sprite-based gameplay mechanics. Also built a physical ESP32 controller in Arduino/C for real-time serial input.",
    link: "https://github.com/LiamG5/sprint0",
    youtube: null,
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

export const skills: Record<string, string[]> = {
  Languages: ["C#", "Java", "C", "JavaScript", "TypeScript", "Python", "SQL", "T-SQL", "HTML/CSS"],
  "Frameworks & Libraries": ["Node.js", "Vue.js", ".NET", "Next.js", "MonoGame", "JUnit", "Make", "GDB"],
  "Dev Tools": ["Git/GitHub", "Linux/WSL", "Visual Studio", "VS Code", "SSMS", "Jira", "Azure"],
};
