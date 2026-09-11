import { supabase, isSupabaseConfigured } from "./supabase";
import type {
  Profile,
  Skill,
  Project,
  Certification,
  Experience,
  RoadmapItem,
  LinkItem,
} from "@/types/database";

// ── DEFAULT / FALLBACK DATA ──────────────────────────────────────────

export const DEFAULT_PROFILE: Profile = {
  id: "default-profile",
  name: "Your Name",
  title: "Creative Developer & AI/Vision Engineer",
  bio: "I'm a creative developer with a deep passion for crafting digital experiences that merge cutting-edge technology with thoughtful design. With expertise spanning full-stack development, AI/ML, and cloud infrastructure, I build systems that scale. My approach combines clean code architecture with a keen eye for user experience, ensuring every project not only works flawlessly but feels intuitive and polished.",
  hero_headlines: [
    {
      eyebrow: "Hi, I'm Your Name",
      lines: ["Creative", "Developer"],
      fontSize: "text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.75rem] 2xl:text-[6.5rem]",
      lineHeight: "leading-[0.92]",
      tagline: "// Turning Ideas Into Reality",
      desc: "Available for hire. Building fast, responsive web applications using modern tech stacks.",
    },
    {
      eyebrow: "Systems & Architecture",
      lines: ["Scalable", "Systems"],
      fontSize: "text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.75rem] 2xl:text-[6.5rem]",
      lineHeight: "leading-[0.92]",
      tagline: "// High-Performance Engineering",
      desc: "Designing robust data pipelines, scalable cloud infrastructure, and low-latency systems.",
    },
    {
      eyebrow: "Intelligent Interfaces",
      lines: ["AI &", "Vision", "Engineer"],
      fontSize: "text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.75rem] 2xl:text-[5.5rem]",
      lineHeight: "leading-[0.95]",
      tagline: "// Next-Gen AI Applications",
      desc: "Integrating state-of-the-art vision models and generative AI into fluid web experiences.",
    },
  ],
  stats: {
    years_experience: "5+",
    projects_completed: "50+",
    happy_clients: "30+",
    certifications_count: "10+",
  },
};

export const DEFAULT_SKILLS: Skill[] = [
  { id: "1", name: "Generative AI", category: "AI/ML", display_order: 1 },
  { id: "2", name: "LLMs", category: "AI/ML", display_order: 2 },
  { id: "3", name: "Computer Vision", category: "AI/ML", display_order: 3 },
  { id: "4", name: "Prompt Engineering", category: "AI/ML", display_order: 4 },
  { id: "5", name: "Machine Learning", category: "AI/ML", display_order: 5 },
  { id: "6", name: "NLP", category: "AI/ML", display_order: 6 },
  { id: "7", name: "Deep Learning", category: "AI/ML", display_order: 7 },
  { id: "8", name: "Data Science", category: "Data", display_order: 8 },
  { id: "9", name: "Neural Networks", category: "AI/ML", display_order: 9 },
  { id: "10", name: "Model Fine-Tuning", category: "AI/ML", display_order: 10 },
  { id: "11", name: "RAG Systems", category: "AI/ML", display_order: 11 },
  { id: "12", name: "Vector Databases", category: "Database", display_order: 12 },
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "1",
    title: "AI Content Generator",
    description:
      "An AI-powered content generation platform with natural language processing capabilities.",
    brief_detail:
      "Next-generation generative text platform with automated multi-modal drafting, tone calibration, and real-time streaming inference.",
    tags: ["Next.js", "OpenAI", "Tailwind"],
    project_url: "#",
    github_url: "https://github.com/vedabrands/portfolio",
    display_order: 1,
  },
  {
    id: "2",
    title: "E-Commerce Dashboard",
    description:
      "Real-time analytics dashboard for e-commerce metrics and insights.",
    brief_detail:
      "High-throughput telemetry and transaction stream visualization platform powered by D3.js and WebSockets.",
    tags: ["React", "D3.js", "Node.js"],
    project_url: "#",
    github_url: "https://github.com/vedabrands/portfolio",
    display_order: 2,
  },
  {
    id: "3",
    title: "Smart Home IoT",
    description:
      "IoT dashboard for monitoring and controlling smart home devices.",
    brief_detail:
      "Low-latency MQTT broker integration with interactive 3D floorplan telemetry and anomaly detection.",
    tags: ["React", "MQTT", "Python"],
    project_url: "#",
    github_url: "https://github.com/vedabrands/portfolio",
    display_order: 3,
  },
  {
    id: "4",
    title: "Portfolio CMS",
    description:
      "Headless CMS-powered portfolio with dynamic content management.",
    brief_detail:
      "Dynamic headless content distribution network with live preview rendering and instant edge synchronization.",
    tags: ["Next.js", "Sanity", "Vercel"],
    project_url: "#",
    github_url: "https://github.com/vedabrands/portfolio",
    display_order: 4,
  },
];

export const DEFAULT_CERTIFICATIONS: Certification[] = [
  {
    id: "1",
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date_issued: "2024",
    description: "Design resilient, high-performing, secure, and cost-optimized cloud architectures on AWS.",
    display_order: 1,
  },
  {
    id: "2",
    title: "Google Cloud Professional",
    issuer: "Google Cloud",
    date_issued: "2024",
    description: "Architect and manage robust, secure, scalable, highly available, and dynamic GCP solutions.",
    display_order: 2,
  },
  {
    id: "3",
    title: "TensorFlow Developer Certificate",
    issuer: "Google",
    date_issued: "2023",
    description: "Deep learning, convolutional neural networks, natural language processing, and sequence models in TensorFlow.",
    display_order: 3,
  },
  {
    id: "4",
    title: "Meta Frontend Developer",
    issuer: "Meta",
    date_issued: "2023",
    description: "Comprehensive React frontend engineering, UX architecture, and modern web application development.",
    display_order: 4,
  },
  {
    id: "5",
    title: "Azure AI Fundamentals",
    issuer: "Microsoft",
    date_issued: "2023",
    description: "Fundamental concepts of artificial intelligence and machine learning workloads on Azure.",
    display_order: 5,
  },
];

export const DEFAULT_EXPERIENCE: Experience[] = [
  {
    id: "1",
    role: "Senior Full-Stack & AI Engineer",
    company: "Veda Brands",
    start_date: "2023",
    end_date: "Present",
    description: "Architecting generative AI interfaces, scalable full-stack web applications, and real-time data pipelines.",
    display_order: 1,
  },
  {
    id: "2",
    role: "Lead Frontend Engineer",
    company: "Tech Innovations",
    start_date: "2021",
    end_date: "2023",
    description: "Led design systems, interactive 3D web visualizations, and optimized performance across distributed apps.",
    display_order: 2,
  },
  {
    id: "3",
    role: "Software Engineer",
    company: "Cloud Matrix",
    start_date: "2019",
    end_date: "2021",
    description: "Developed scalable REST APIs, microservices, and automated CI/CD deployment pipelines.",
    display_order: 3,
  },
];

export const DEFAULT_ROADMAP: RoadmapItem[] = [
  {
    id: "01",
    label: "ROOT 01",
    title: "Frontend Development",
    description: "Architecting responsive, high-performance UI components.",
    tag: "React & Tailwind",
    tech: "React & Tailwind",
    display_order: 1,
  },
  {
    id: "02",
    label: "ROOT 02",
    title: "Backend Development",
    description: "Building secure REST APIs and robust data pipelines.",
    tag: "Node.js & Databases",
    tech: "Node.js & Databases",
    display_order: 2,
  },
  {
    id: "03",
    label: "ROOT 03",
    title: "AI & Machine Learning",
    description: "Integrating intelligent models and automated workflows.",
    tag: "Generative AI & LLMs",
    tech: "Generative AI & LLMs",
    display_order: 3,
  },
  {
    id: "04",
    label: "ROOT 04",
    title: "Cloud & Deployment",
    description: "Containerizing systems and ensuring seamless production.",
    tag: "Docker & CI/CD",
    tech: "Docker & CI/CD",
    display_order: 4,
  },
];

export const DEFAULT_LINKS: LinkItem[] = [
  { id: "1", label: "Email", url: "mailto:unifiedram@gmail.com", icon_name: "mail", display_order: 1 },
  { id: "2", label: "GitHub", url: "https://github.com/vedabrands/portfolio", icon_name: "github", display_order: 2 },
  { id: "3", label: "LinkedIn", url: "https://linkedin.com", icon_name: "linkedin", display_order: 3 },
  { id: "4", label: "Twitter", url: "https://twitter.com", icon_name: "twitter", display_order: 4 },
  { id: "5", label: "Home", url: "#hero", icon_name: "nav", display_order: 5 },
  { id: "6", label: "About", url: "#about", icon_name: "nav", display_order: 6 },
  { id: "7", label: "Expertise", url: "#expertise", icon_name: "nav", display_order: 7 },
  { id: "8", label: "Skills", url: "#skills", icon_name: "nav", display_order: 8 },
  { id: "9", label: "Projects", url: "#projects", icon_name: "nav", display_order: 9 },
  { id: "10", label: "Certifications", url: "#certifications", icon_name: "nav", display_order: 10 },
  { id: "11", label: "Contact", url: "#contact", icon_name: "nav", display_order: 11 },
];

// ── DYNAMIC ASYNC SUPABASE FETCHERS ──────────────────────────────────

export async function getProfile(): Promise<Profile> {
  if (!isSupabaseConfigured() || !supabase) return DEFAULT_PROFILE;
  try {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) return DEFAULT_PROFILE;
    return data as Profile;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function getSkills(): Promise<Skill[]> {
  if (!isSupabaseConfigured() || !supabase) return DEFAULT_SKILLS;
  try {
    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) return DEFAULT_SKILLS;
    return data as Skill[];
  } catch {
    return DEFAULT_SKILLS;
  }
}

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured() || !supabase) return DEFAULT_PROJECTS;
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) return DEFAULT_PROJECTS;
    return data as Project[];
  } catch {
    return DEFAULT_PROJECTS;
  }
}

export async function getCertifications(): Promise<Certification[]> {
  if (!isSupabaseConfigured() || !supabase) return DEFAULT_CERTIFICATIONS;
  try {
    const { data, error } = await supabase
      .from("certifications")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) return DEFAULT_CERTIFICATIONS;
    return data as Certification[];
  } catch {
    return DEFAULT_CERTIFICATIONS;
  }
}

export async function getExperience(): Promise<Experience[]> {
  if (!isSupabaseConfigured() || !supabase) return DEFAULT_EXPERIENCE;
  try {
    const { data, error } = await supabase
      .from("experience")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) return DEFAULT_EXPERIENCE;
    return data as Experience[];
  } catch {
    return DEFAULT_EXPERIENCE;
  }
}

export async function getRoadmap(): Promise<RoadmapItem[]> {
  if (!isSupabaseConfigured() || !supabase) return DEFAULT_ROADMAP;
  try {
    const { data, error } = await supabase
      .from("roadmap")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) return DEFAULT_ROADMAP;
    return data as RoadmapItem[];
  } catch {
    return DEFAULT_ROADMAP;
  }
}

export async function getLinks(): Promise<LinkItem[]> {
  if (!isSupabaseConfigured() || !supabase) return DEFAULT_LINKS;
  try {
    const { data, error } = await supabase
      .from("links")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) return DEFAULT_LINKS;
    return data as LinkItem[];
  } catch {
    return DEFAULT_LINKS;
  }
}

export async function getPortfolioData() {
  const [profile, skills, projects, certifications, experience, roadmap, links] =
    await Promise.all([
      getProfile(),
      getSkills(),
      getProjects(),
      getCertifications(),
      getExperience(),
      getRoadmap(),
      getLinks(),
    ]);

  return {
    profile,
    skills,
    projects,
    certifications,
    experience,
    roadmap,
    links,
  };
}
