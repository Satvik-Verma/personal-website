export interface SocialLink {
  platform: "linkedin" | "github" | "scholar" | "email";
  url: string;
  label: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface ExperienceRole {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  techStack: string[];
  subProjects?: { name: string; bullets: string[] }[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link?: string;
  featured: boolean;
  category: "product" | "research" | "personal";
}

export interface Publication {
  title: string;
  venue: string;
  year: number;
  type: "paper" | "forum";
  description: string;
  link?: string;
}

export interface Award {
  title: string;
  event: string;
  year: number;
  link?: string;
}

export interface Certification {
  title: string;
  provider?: string;
}

export interface Leadership {
  id: string;
  organization: string;
  role: string;
  period: string;
  location: string;
  description: string;
}

export interface SkillCategory {
  domain: string;
  skills: string[];
}

export interface HeroSkill {
  label: string;
  color: string;
  scale?: number;
}
