import type {
  SocialLink,
  Stat,
  ExperienceRole,
  Project,
  Publication,
  Award,
  Certification,
  Leadership,
  SkillCategory,
  HeroSkill,
} from "@/types";

export const identity = {
  name: "Satvik Verma",
  title: "Founder, Researcher, Engineer",
  tagline: "Drawn to what doesn\u2019t exist yet; and wired to make it real.",
  location: "San Francisco, CA",
  email: "satvikrohella@gmail.com",
};

export const bio =
  "Founding engineer who ships 0\u21921 across full-stack products and integration-heavy healthcare backends. Launched Xuman.AI on the App Store in ~3 months with a team of two, owning mobile, backend, infrastructure, payments, and real-time video. Built production EHR integrations (FHIR R4, Canvas Medical) and clinical data pipelines from scratch. Strong at rapid iteration, production reliability, and translating ambiguous requirements into working systems.";

export const bioExtended =
  "Product-driven software engineering generalist. Currently building production EHR integrations for a stealth healthcare startup while continuing to lead Xuman.AI. Founded Style.AI to bring AI-powered fashion intelligence to the real world. Published researcher at AAAI and IEEE on LLM-based IoT security and ML for fusion energy. Hackathon winner (SF Hacks 2024 \u2014 Best GenAI Hack). Refounded and led the AI Club at SF State as President.";

export const socialLinks: SocialLink[] = [
  {
    platform: "linkedin",
    url: "https://www.linkedin.com/in/satvik-verma-b2000/",
    label: "LinkedIn",
  },
  {
    platform: "github",
    url: "https://github.com/Satvik-Verma",
    label: "GitHub",
  },
  {
    platform: "scholar",
    url: "https://scholar.google.com/citations?user=5LnzwLkAAAAJ&hl=en",
    label: "Google Scholar",
  },
  {
    platform: "email",
    url: "mailto:satvikrohella@gmail.com",
    label: "Email",
  },
];

export const stats: Stat[] = [
  { value: "8", label: "Engineers Led" },
  { value: "2", label: "Apps Shipped" },
  { value: "4", label: "Publications" },
  { value: "200+", label: "Style.AI Users" },
];

export const experience: ExperienceRole[] = [
  {
    id: "stealth",
    company: "Stealth Startup",
    role: "Freelance Healthcare Integration Engineer",
    period: "Jan 2026 \u2013 Present",
    location: "Remote",
    bullets: [
      "Architected and built production EHR integration with Canvas Medical (FHIR R4): OAuth2 authentication, patient CRUD, appointment scheduling, insurance coverage creation, and real-time eligibility verification via Claim.MD clearinghouse.",
      "Developed clinical event plugins (Python) with HMAC-signed webhook handling, and payor normalization layer mapping consumer insurance names to FHIR Organization references for eligibility workflows.",
      "Led PHI architecture refactoring, removed patient demographics from application database, fetching on-demand from EHR to eliminate HIPAA-compliant hosting overhead.",
    ],
    techStack: [
      "Python",
      "FHIR R4",
      "Canvas Medical",
      "Claim.MD",
      "Webhooks",
      "OAuth2",
    ],
  },
  {
    id: "xuman",
    company: "Xuman.AI",
    role: "Founding Engineer / Product & AI Lead (0\u21921)",
    period: "Aug 2025 \u2013 Present",
    location: "San Francisco, CA",
    bullets: [
      "Took Xuman from concept \u2192 production: shipped iOS app live on the App Store; Android release in progress.",
      "Led a team of up to 8 engineers across mobile, backend, and infra; owned sprint planning, task breakdown, code reviews, and release coordination.",
      "Owned end-to-end architecture: React Native (Expo) mobile client, NestJS services, Postgres/Prisma data layer, Redis caching/queues, and Azure deployments. Set up CI/CD and release engineering.",
      "Built booking lifecycle (discovery \u2192 scheduling \u2192 payment \u2192 session \u2192 feedback), hardening edge cases through rapid iteration and production incident triage.",
    ],
    techStack: [
      "TypeScript",
      "React Native",
      "Expo/EAS",
      "NestJS",
      "Postgres/Prisma",
      "Redis",
      "LiveKit/WebRTC",
      "Azure",
      "Stripe Connect",
      "GitHub Actions",
    ],
  },
  {
    id: "styleai",
    company: "Style.AI",
    role: "Founder & Software Engineer",
    period: "Jan 2025 \u2013 Aug 2025",
    location: "San Francisco, CA",
    bullets: [
      "Built a full-stack AI wardrobe assistant (React Native, FastAPI, PyTorch) that scans clothing via computer vision, generates personalized outfit recommendations, and uses an active learning pipeline trained on 52K+ images.",
    ],
    techStack: ["React Native", "FastAPI", "PyTorch", "Computer Vision", "Python"],
  },
  {
    id: "sfsu",
    company: "San Francisco State University",
    role: "Researcher",
    period: "Feb 2024 \u2013 June 2025",
    location: "San Francisco, CA",
    bullets: [],
    techStack: [
      "Python",
      "MLP",
      "GPR",
      "RFR",
      "LangChain",
      "RAG",
      "HPC",
      "NERSC Perlmutter",
    ],
    subProjects: [
      {
        name: "FusionML",
        bullets: [
          "Developed ML surrogate models for predicting plasma behavior in fusion tokamak devices; collaborated across research stakeholders.",
        ],
      },
      {
        name: "IoT Security",
        bullets: [
          "LLM/RAG-based IoT attack detection using feature ranking and knowledge-base prompting; evaluated on public IoT datasets.",
        ],
      },
    ],
  },
];

export const leadership: Leadership[] = [
  {
    id: "ai-club",
    organization: "AI Club at SF State",
    role: "President",
    period: "Sep 2023 \u2013 May 2025",
    location: "San Francisco, CA",
    description:
      "Refounded and led the AI Club on campus, fostering a vibrant community. Organized dynamic workshops where participants learned to code AI products from scratch, and curated networking events to empower students to explore AI\u2019s potential.",
  },
  {
    id: "acm",
    organization: "ACM at SFSU",
    role: "Officer",
    period: "Sep 2023 \u2013 May 2025",
    location: "San Francisco, CA",
    description:
      "Served as an officer in the Association for Computing Machinery chapter at SFSU.",
  },
];

export const projects: Project[] = [
  {
    id: "xuman",
    title: "Xuman.AI",
    description:
      "Concept to App Store in ~3 months. React Native (Expo) mobile client, NestJS microservices, Postgres/Prisma, Redis, LiveKit/WebRTC real-time video, Stripe Connect payments, and Azure deployments.",
    techStack: [
      "React Native",
      "NestJS",
      "PostgreSQL",
      "LiveKit",
      "Stripe Connect",
      "Azure",
    ],
    featured: true,
    category: "product",
  },
  {
    id: "styleai",
    title: "Style.AI",
    description:
      "Full-stack AI wardrobe assistant (React Native, FastAPI, PyTorch) that scans clothing via computer vision, generates personalized outfit recommendations, and uses an active learning pipeline trained on 52K+ images.",
    techStack: ["React Native", "FastAPI", "PyTorch", "Computer Vision", "Python"],
    featured: true,
    category: "product",
  },
  {
    id: "fusionml",
    title: "FusionML",
    description:
      "ML surrogate models for fusion tokamak plasma prediction. Multi-institutional effort with MIT, Princeton Plasma Physics Lab, and LBNL. Increased efficiency by 25%.",
    techStack: ["Python", "MLP", "GPR", "RFR", "HPC"],
    link: "https://arxiv.org/abs/2409.06122",
    featured: false,
    category: "research",
  },
  {
    id: "iot-security",
    title: "IoT Attack Detection",
    description:
      "LLM/RAG-based IoT attack detection with feature ranking. Accepted at AAAI Spring Symposium 2025 and IEEE DSAA-SF 2024.",
    techStack: ["Python", "LLMs", "RAG", "LangChain"],
    link: "https://ojs.aaai.org/index.php/AAAI-SS/article/view/35587",
    featured: false,
    category: "research",
  },
  {
    id: "emotion-detector",
    title: "Emotion Detector",
    description:
      "Real-time emotion detection system using computer vision and deep learning.",
    techStack: ["Python", "OpenCV", "Deep Learning"],
    link: "https://github.com/Satvik-Verma/emotion-detector",
    featured: false,
    category: "personal",
  },
  {
    id: "stock-market",
    title: "Stock Market Trading",
    description:
      "Stock market trading system exploring algorithmic trading strategies.",
    techStack: ["Python", "Data Analysis"],
    link: "https://github.com/Satvik-Verma/stock-market",
    featured: false,
    category: "personal",
  },
];

export const publications: Publication[] = [
  {
    title:
      "Intelligent IoT Attack Detection Design via ODLLM with Feature Ranking-based Knowledge Base",
    venue: "AAAI Spring Symposium Series 2025",
    year: 2025,
    type: "paper",
    description:
      "LLM/RAG-based approach to IoT attack detection on edge devices. Accepted for Proceedings at AAAI Spring Symposium Series 2025, GenAI@Edge track.",
    link: "https://ojs.aaai.org/index.php/AAAI-SS/article/view/35587",
  },
  {
    title:
      "Case Study: Leveraging GenAI to Build AI-based Surrogates and Regressors for Modeling Radio Frequency Heating in Fusion Energy Science",
    venue: "arXiv",
    year: 2024,
    type: "paper",
    description:
      "Explores using generative AI to build ML surrogates for RF heating modeling in fusion energy, part of the multi-institutional FusionML effort.",
    link: "https://arxiv.org/abs/2409.06122",
  },
  {
    title:
      'Results and Lessons Learned from the "Accelerating Radio Frequency Modeling Using Machine Learning" Project',
    venue: "American Physical Society (DPP 2024)",
    year: 2024,
    type: "paper",
    description:
      "Comprehensive results and insights from the multi-institutional RF modeling acceleration project spanning MIT, Princeton, and LBNL.",
    link: "https://meetings.aps.org/Meeting/DPP24/Session/TO07.4",
  },
  {
    title: "Research Proposal \u2014 IoT Security with LLMs",
    venue: "IEEE DSAA-SF Student Forum",
    year: 2024,
    type: "forum",
    description:
      "Research proposal on applying large language models to IoT security challenges, accepted and presented.",
  },
];

export const awards: Award[] = [
  {
    title: "Best GenAI Hack",
    event: "SF Hacks 2024",
    year: 2024,
    link: "https://devpost.com/software/travpilot",
  },
];

export const certifications: Certification[] = [
  { title: "Introduction to Artificial Intelligence (AI)" },
  { title: "Introduction to Deep Learning & Neural Networks with Keras" },
  { title: "Crash Course on Python" },
];

export const skillCategories: SkillCategory[] = [
  {
    domain: "Languages",
    skills: ["Python", "C++", "TypeScript", "C", "JavaScript", "SQL", "Bash"],
  },
  {
    domain: "Backend",
    skills: [
      "NestJS",
      "REST APIs",
      "Microservices",
      "Prisma ORM",
      "PostgreSQL",
      "Redis",
      "Webhooks",
      "Stripe Connect",
      "FHIR R4",
    ],
  },
  {
    domain: "Technologies",
    skills: ["WebRTC/LiveKit", "React Native", "Expo/EAS", "Terraform", "Azure Container Apps", "GitHub Actions CI/CD"],
  },
  {
    domain: "AI / ML",
    skills: [
      "LLM/RAG (LangChain)",
      "MCP",
      "Multi-Agent Orchestration",
      "Feature Ranking",
      "CV/NLP Evaluation",
    ],
  },
];

export const heroSkills: HeroSkill[] = [
  { label: "Python", color: "#3b82f6", scale: 1.2 },
  { label: "TypeScript", color: "#3b82f6", scale: 1.15 },
  { label: "React Native", color: "#ec4899", scale: 1.1 },
  { label: "NestJS", color: "#10b981", scale: 1.1 },
  { label: "PostgreSQL", color: "#10b981", scale: 1.0 },
  { label: "Redis", color: "#10b981", scale: 0.9 },
  { label: "LLM/RAG", color: "#8b5cf6", scale: 1.15 },
  { label: "MCP", color: "#8b5cf6", scale: 0.95 },
  { label: "WebRTC", color: "#06b6d4", scale: 0.9 },
  { label: "FHIR R4", color: "#10b981", scale: 0.9 },
  { label: "Terraform", color: "#f59e0b", scale: 0.9 },
  { label: "Azure", color: "#f59e0b", scale: 0.95 },
  { label: "Stripe", color: "#8b5cf6", scale: 0.9 },
  { label: "C++", color: "#3b82f6", scale: 0.85 },
];

export const education = [
  {
    degree: "M.S. Computer Science",
    school: "San Francisco State University",
    year: "Aug 2023 \u2013 May 2025",
  },
];
