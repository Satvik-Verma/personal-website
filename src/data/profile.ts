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
  "Product-driven founding engineer who ships 0\u21921. Built Xuman.AI from first principles and took it from early R&D to production launch\u2014iOS and Android live. Started by designing the intelligence layer and real-time interaction stack, then expanded into end-to-end ownership of product execution, engineering leadership, and platform reliability. Led and scaled a high-velocity team of up to ~9 engineers.";

export const bioExtended =
  "Explorer. Tech-savvy AI Pioneer. Passionate about pushing the limits of Agentic models, NLP, and Computer Vision. Founded Style.AI to bring AI-powered fashion intelligence to the real world. Published researcher at AAAI and IEEE on LLM-based IoT security and ML for fusion energy. Hackathon winner (SF Hacks 2024 \u2014 Best GenAI Hack). Refounded and led the AI Club at SF State as President.";

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
  { value: "~9", label: "Engineers Led" },
  { value: "2", label: "Apps Shipped" },
  { value: "4", label: "Publications" },
  { value: "200+", label: "Style.AI Users" },
];

export const experience: ExperienceRole[] = [
  {
    id: "xuman",
    company: "Xuman.AI",
    role: "Founding Engineer & Product Lead (0\u21921)",
    period: "Aug 2025 \u2013 Present",
    location: "San Francisco, CA",
    bullets: [
      "Built Xuman.AI from first principles and took it from early R&D to production launch 0\u21921 (iOS and Android live).",
      "Designed the intelligence layer: built agentic workflows for planning, retrieval, ranking, and personalization (LangGraph/RAG) for real product usage.",
      "Implemented low-latency real-time communication with LiveKit (WebRTC) for audio/video sessions and interactive experiences.",
      "Designed and built a distributed marketplace backend in NestJS spanning Auth, Users, Bookings, Payments, Messaging, and AI services.",
      "Orchestrated inter-service workflows with Azure Service Bus + RabbitMQ (async processing, retries, state transitions).",
      "Engineered complex relational schemas for availability, scheduling, matching, and transactions (Postgres + Prisma).",
      "Implemented Stripe Connect for multi-party payments, payouts, webhook-driven state machines, idempotency and failure recovery.",
      "Built the React Native app and owned release execution (CI/CD, App Store/TestFlight, production hardening).",
      "Led and scaled execution: ran technical interviews, hired, and led a high-velocity team (up to ~9 engineers), while partnering on roadmap and business tradeoffs.",
    ],
    techStack: [
      "TypeScript",
      "React Native",
      "NestJS",
      "Postgres/Prisma",
      "LiveKit/WebRTC",
      "Azure Service Bus",
      "RabbitMQ",
      "Stripe Connect",
      "LangGraph",
      "GitHub Actions",
    ],
  },
  {
    id: "styleai",
    company: "Style.AI",
    role: "Founder & Engineer",
    period: "Mar 2025 \u2013 Aug 2025",
    location: "San Francisco, CA",
    bullets: [
      "Built a personalized AI fashion assistant using LLMs and computer vision, improving outfit decision time by 30%.",
      "Scaled early access program to 200+ users within 1 month through AI-driven recommendations.",
      "Designed data flows for user wardrobe capture, catalog normalization, and recommendation logic.",
      "Long-term vision: AI-powered mirrors in retail stores and ecommerce for virtual try-on and styling.",
    ],
    techStack: ["Python", "LLMs", "Computer Vision", "Data Pipelines"],
  },
  {
    id: "sfsu",
    company: "San Francisco State University",
    role: "Research Assistant",
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
        name: "FusionML \u2014 AI Lead",
        bullets: [
          "Led ML surrogate model development for predicting plasma behavior in fusion tokamak devices as part of a multi-institutional effort led by J. Wright at MIT, with Princeton Plasma Physics Lab and Lawrence Berkeley National Lab.",
          "Built models using MLP, GPR, and RFR; tuned and optimized hyperparameters. Increased model efficiency by 25% and decreased losses from initial paper by 12%.",
          "Built evaluation pipelines (error metrics, ablations, variance analysis) and ran experiments on HPC resources (NERSC Perlmutter supercomputer).",
        ],
      },
      {
        name: "IoT Security",
        bullets: [
          "Built and trained ML models to predict IoT attacks on network traffic using CICIoT2023 and Aposemat IoT 2023 datasets.",
          "LLM/RAG-based attack detection using feature ranking and knowledge-base prompting.",
          "Paper accepted at 2 conferences: DSAA-SF 2024 and AAAI Spring Symposium Series 2025. Accepted for Proceedings at AAAI 2025.",
        ],
      },
    ],
  },
  {
    id: "corizo",
    company: "Corizo",
    role: "Machine Learning Intern",
    period: "Dec 2022 \u2013 Feb 2023",
    location: "Remote",
    bullets: [
      "Trained on ML models for big conversational data. Built and deployed models in the workflow.",
      "Increased model accuracy by 17%. Part of the team for the final deployment of the model.",
    ],
    techStack: ["Python", "ML", "NLP", "Data Science"],
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
      "Full-stack marketplace platform shipped to the App Store. Agentic AI workflows, real-time video sessions (LiveKit/WebRTC), Stripe Connect payments, distributed NestJS backend, and event-driven architecture.",
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
      "AI fashion assistant using LLMs + computer vision. Improved outfit decision time by 30%, scaled to 200+ users in the first month. Vision: AI-powered mirrors in retail stores.",
    techStack: ["Python", "LLMs", "Computer Vision", "Data Pipelines"],
    featured: true,
    category: "product",
  },
  {
    id: "fusionml",
    title: "FusionML",
    description:
      "ML surrogate models for fusion tokamak plasma prediction. Multi-institutional effort with MIT, Princeton Plasma Physics Lab, and LBNL. Increased efficiency by 25%.",
    techStack: ["Python", "MLP", "GPR", "RFR", "HPC"],
    featured: false,
    category: "research",
  },
  {
    id: "iot-security",
    title: "IoT Attack Detection",
    description:
      "LLM/RAG-based IoT attack detection with feature ranking. Accepted at AAAI Spring Symposium 2025 and IEEE DSAA-SF 2024.",
    techStack: ["Python", "LLMs", "RAG", "LangChain"],
    link: "https://github.com/Satvik-Verma/IoT_Attack",
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
  },
  {
    title:
      "Case Study: Leveraging GenAI to Build AI-based Surrogates and Regressors for Modeling Radio Frequency Heating in Fusion Energy Science",
    venue: "Publication",
    year: 2025,
    type: "paper",
    description:
      "Explores using generative AI to build ML surrogates for RF heating modeling in fusion energy, part of the multi-institutional FusionML effort.",
  },
  {
    title:
      'Results and Lessons Learned from the "Accelerating Radio Frequency Modeling Using Machine Learning" Project',
    venue: "Publication",
    year: 2025,
    type: "paper",
    description:
      "Comprehensive results and insights from the multi-institutional RF modeling acceleration project spanning MIT, Princeton, and LBNL.",
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
    domain: "Backend & Infrastructure",
    skills: [
      "NestJS",
      "REST APIs",
      "Microservices",
      "Prisma ORM",
      "PostgreSQL",
      "Redis",
      "Webhooks",
      "Stripe Connect",
    ],
  },
  {
    domain: "Mobile & Frontend",
    skills: ["React Native", "Expo/EAS"],
  },
  {
    domain: "Cloud & DevOps",
    skills: [
      "Terraform",
      "Azure Container Apps",
      "Azure Service Bus",
      "RabbitMQ",
      "GitHub Actions CI/CD",
    ],
  },
  {
    domain: "AI / ML",
    skills: [
      "LLM/RAG",
      "LangChain",
      "LangGraph",
      "MCP",
      "Multi-Agent Orchestration",
      "Agentic Workflows",
      "Feature Ranking",
      "CV/NLP",
      "HPC (Perlmutter)",
    ],
  },
  {
    domain: "Real-Time",
    skills: ["WebRTC", "LiveKit"],
  },
];

export const heroSkills: HeroSkill[] = [
  { label: "Python", color: "#3b82f6", scale: 1.2 },
  { label: "TypeScript", color: "#3b82f6", scale: 1.15 },
  { label: "React Native", color: "#ec4899", scale: 1.1 },
  { label: "NestJS", color: "#10b981", scale: 1.1 },
  { label: "PostgreSQL", color: "#10b981", scale: 1.0 },
  { label: "Redis", color: "#10b981", scale: 0.9 },
  { label: "LLMs", color: "#8b5cf6", scale: 1.15 },
  { label: "LangGraph", color: "#8b5cf6", scale: 0.95 },
  { label: "WebRTC", color: "#06b6d4", scale: 0.9 },
  { label: "Azure", color: "#f59e0b", scale: 0.95 },
  { label: "Stripe", color: "#8b5cf6", scale: 0.9 },
  { label: "Prisma", color: "#10b981", scale: 0.9 },
  { label: "C++", color: "#3b82f6", scale: 0.85 },
  { label: "RAG", color: "#8b5cf6", scale: 0.9 },
];

export const education = [
  {
    degree: "M.S. Computer Science",
    school: "San Francisco State University",
    year: "Aug 2023 \u2013 May 2025",
  },
  {
    degree: "B.S. Computer Science Engineering",
    school: "Guru Gobind Singh Indraprastha University",
    year: "Aug 2019 \u2013 July 2023",
  },
];
