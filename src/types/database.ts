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

export interface RoadmapItem {
  id: string;
  label?: string | null;
  title: string;
  description: string;
  tag?: string | null;
  tech?: string | null;
  display_order: number;
}

export interface LinkItem {
  id: string;
  label: string;
  url: string;
  icon_name?: string | null;
  display_order: number;
}

export interface SiteVisit {
  id: string;
  page_path: string;
  timestamp: string;
  referrer?: string | null;
  user_agent?: string | null;
  browser?: string | null;
  device_type?: string | null;
  country?: string | null;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profile: {
        Row: {
          id: string;
          name: string;
          title: string;
          bio: string;
          hero_headlines: Json;
          stats: Json;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          name?: string;
          title?: string;
          bio?: string;
          hero_headlines?: Json;
          stats?: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          title?: string;
          bio?: string;
          hero_headlines?: Json;
          stats?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: Skill;
        Insert: Omit<Skill, "id"> & { id?: string };
        Update: Partial<Skill>;
        Relationships: [];
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, "id"> & { id?: string };
        Update: Partial<Project>;
        Relationships: [];
      };
      certifications: {
        Row: Certification;
        Insert: Omit<Certification, "id"> & { id?: string };
        Update: Partial<Certification>;
        Relationships: [];
      };
      experience: {
        Row: Experience;
        Insert: Omit<Experience, "id"> & { id?: string };
        Update: Partial<Experience>;
        Relationships: [];
      };
      roadmap: {
        Row: RoadmapItem;
        Insert: Omit<RoadmapItem, "id"> & { id?: string };
        Update: Partial<RoadmapItem>;
        Relationships: [];
      };
      links: {
        Row: LinkItem;
        Insert: Omit<LinkItem, "id"> & { id?: string };
        Update: Partial<LinkItem>;
        Relationships: [];
      };
      site_visits: {
        Row: SiteVisit;
        Insert: Omit<SiteVisit, "id" | "timestamp"> & {
          id?: string;
          timestamp?: string;
        };
        Update: Partial<SiteVisit>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
