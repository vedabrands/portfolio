export interface HeadlineItem {
  eyebrow: string;
  lines: string[];
  fontSize: string;
  lineHeight: string;
  tagline: string;
  desc: string;
}

export interface StatsData {
  years_experience?: string;
  projects_completed?: string;
  happy_clients?: string;
  certifications_count?: string;
  [key: string]: string | undefined;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  hero_headlines: HeadlineItem[];
  stats: StatsData;
  updated_at?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  display_order: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  brief_detail?: string | null;
  tags: string[];
  image_url?: string | null;
  project_url: string;
  github_url: string;
  display_order: number;
  created_at?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date_issued: string;
  description?: string | null;
  image_url?: string | null;
  display_order: number;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  start_date: string;
  end_date: string;
  description?: string | null;
  display_order: number;
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
  icon_name?: string | null;
  display_order: number;
}

export interface Database {
  public: {
    Tables: {
      profile: {
        Row: Profile;
        Insert: Omit<Profile, "id"> & { id?: string };
        Update: Partial<Profile>;
      };
      skills: {
        Row: Skill;
        Insert: Omit<Skill, "id"> & { id?: string };
        Update: Partial<Skill>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, "id"> & { id?: string };
        Update: Partial<Project>;
      };
      certifications: {
        Row: Certification;
        Insert: Omit<Certification, "id"> & { id?: string };
        Update: Partial<Certification>;
      };
      experience: {
        Row: Experience;
        Insert: Omit<Experience, "id"> & { id?: string };
        Update: Partial<Experience>;
      };
      links: {
        Row: LinkItem;
        Insert: Omit<LinkItem, "id"> & { id?: string };
        Update: Partial<LinkItem>;
      };
    };
  };
}
