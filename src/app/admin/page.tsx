"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type {
  Profile,
  Skill,
  Project,
  Certification,
  Experience,
  RoadmapItem,
  LinkItem,
} from "@/types/database";
import {
  DEFAULT_PROFILE,
  DEFAULT_SKILLS,
  DEFAULT_PROJECTS,
  DEFAULT_CERTIFICATIONS,
  DEFAULT_EXPERIENCE,
  DEFAULT_ROADMAP,
  DEFAULT_LINKS,
} from "@/lib/data";

import ProfileHeroTab from "@/components/admin/ProfileHeroTab";
import AboutStatsTab from "@/components/admin/AboutStatsTab";
import SkillsTab from "@/components/admin/SkillsTab";
import RoadmapTab from "@/components/admin/RoadmapTab";
import ProjectsTab from "@/components/admin/ProjectsTab";
import CertificationsTab from "@/components/admin/CertificationsTab";
import ExperienceTab from "@/components/admin/ExperienceTab";
import LinksTab from "@/components/admin/LinksTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";

type AdminTab =
  | "profile"
  | "about"
  | "skills"
  | "roadmap"
  | "projects"
  | "certifications"
  | "experience"
  | "links"
  | "analytics";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("projects");
  const [authChecking, setAuthChecking] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Data states
  const [loadingData, setLoadingData] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);

  // 1. Session verification & persistence
  useEffect(() => {
    const checkAuth = async () => {
      // 1. Check active Supabase auth session
      if (isSupabaseConfigured() && supabase) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          setUserEmail(data.session.user.email || "Admin");
          setAuthChecking(false);
          return;
        }
      }

      // 2. Check local persistent session
      if (typeof window !== "undefined") {
        const localSession = localStorage.getItem("portfolio_admin_session");
        if (localSession) {
          try {
            const parsed = JSON.parse(localSession);
            if (parsed.authenticated) {
              setUserEmail(parsed.email || "Admin");
              setAuthChecking(false);
              return;
            }
          } catch {}
        }
      }

      router.push("/admin/login");
    };

    checkAuth();

    if (isSupabaseConfigured() && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (!session) {
            if (typeof window !== "undefined" && !localStorage.getItem("portfolio_admin_session")) {
              router.push("/admin/login");
            }
          } else {
            setUserEmail(session.user.email || "Admin");
            setAuthChecking(false);
          }
        }
      );

      return () => {
        authListener?.subscription.unsubscribe();
      };
    }
  }, [router]);

  // 2. Fetch all data for tabs
  const fetchAllData = useCallback(async () => {
    setLoadingData(true);

    if (!isSupabaseConfigured() || !supabase) {
      setProfile(DEFAULT_PROFILE);
      setSkills(DEFAULT_SKILLS);
      setProjects(DEFAULT_PROJECTS);
      setCertifications(DEFAULT_CERTIFICATIONS);
      setExperience(DEFAULT_EXPERIENCE);
      setRoadmap(DEFAULT_ROADMAP);
      setLinks(DEFAULT_LINKS);
      setLoadingData(false);
      return;
    }

    const client = supabase;

    try {
      const { data: profileData } = await client.from("profile").select("*").single();
      const { data: skillsData } = await client.from("skills").select("*").order("display_order", { ascending: true });
      const { data: projectsData } = await client.from("projects").select("*").order("display_order", { ascending: true });
      const { data: certsData } = await client.from("certifications").select("*").order("display_order", { ascending: true });
      const { data: expData } = await client.from("experience").select("*").order("display_order", { ascending: true });
      const { data: roadmapData } = await client.from("roadmap").select("*").order("display_order", { ascending: true });
      const { data: linksData } = await client.from("links").select("*").order("display_order", { ascending: true });

      setProfile((profileData as Profile) || DEFAULT_PROFILE);
      setSkills((skillsData && skillsData.length > 0 ? skillsData : DEFAULT_SKILLS) as Skill[]);
      setProjects((projectsData && projectsData.length > 0 ? projectsData : DEFAULT_PROJECTS) as Project[]);
      setCertifications((certsData && certsData.length > 0 ? certsData : DEFAULT_CERTIFICATIONS) as Certification[]);
      setExperience((expData && expData.length > 0 ? expData : DEFAULT_EXPERIENCE) as Experience[]);
      setRoadmap((roadmapData && roadmapData.length > 0 ? roadmapData : DEFAULT_ROADMAP) as RoadmapItem[]);
      setLinks((linksData && linksData.length > 0 ? linksData : DEFAULT_LINKS) as LinkItem[]);
    } catch (err) {
      console.error("Failed to load CMS data:", err);
      setProfile(DEFAULT_PROFILE);
      setSkills(DEFAULT_SKILLS);
      setProjects(DEFAULT_PROJECTS);
      setCertifications(DEFAULT_CERTIFICATIONS);
      setExperience(DEFAULT_EXPERIENCE);
      setRoadmap(DEFAULT_ROADMAP);
      setLinks(DEFAULT_LINKS);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!authChecking) {
      fetchAllData();
    }
  }, [authChecking, fetchAllData]);

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("portfolio_admin_session");
    }
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/admin/login");
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-xs text-muted tracking-wider">
          AUTHENTICATING SESSION...
        </p>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: string; count?: number }[] = [
    { id: "projects", label: "Projects", icon: "⚡", count: projects.length },
    { id: "roadmap", label: "Roadmap Cards", icon: "🗺️", count: roadmap.length },
    { id: "profile", label: "Profile & Hero", icon: "👤" },
    { id: "about", label: "About & Stats", icon: "📊" },
    { id: "skills", label: "Skills Marquee", icon: "🛠️", count: skills.length },
    { id: "experience", label: "Experience", icon: "💼", count: experience.length },
    { id: "certifications", label: "Certifications", icon: "🏆", count: certifications.length },
    { id: "links", label: "Links & Socials", icon: "🔗", count: links.length },
    { id: "analytics", label: "Visitor Analytics", icon: "📈" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Header */}
      <header className="border-b border-card-border/60 bg-[#0c0c0e]/80 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_8px_rgba(217,164,65,0.7)] animate-pulse" />
          <div>
            <h1 className="font-display text-base font-bold text-foreground tracking-wide flex items-center gap-2">
              PORTFOLIO CMS <span className="text-accent text-xs font-mono font-normal">{"//"} PORTAL</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#18181b] border border-card-border rounded-xl font-mono text-xs text-muted hover:text-foreground hover:border-accent transition-all"
          >
            <span>Live Site ↗</span>
          </Link>

          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-card-border/20 rounded-xl font-mono text-[11px] text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="truncate max-w-[160px]">{userEmail}</span>
          </div>

          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-950/70 hover:border-red-500/50 rounded-xl font-mono text-xs transition-all active:scale-95"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-8">
        {/* Navigation Sidebar / Tab Strip */}
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          <div className="p-2 mb-2">
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest block">
              {"//"} CMS Modules
            </span>
          </div>

          <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-mono text-xs transition-all whitespace-nowrap md:whitespace-normal w-full text-left ${
                    active
                      ? "bg-accent/15 border border-accent/40 text-accent font-bold shadow-[0_0_15px_rgba(217,164,65,0.08)]"
                      : "bg-[#111113] md:bg-transparent border border-transparent md:border-none text-muted hover:text-foreground hover:bg-[#18181b]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>

                  {tab.count !== undefined && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        active
                          ? "bg-accent text-background font-bold"
                          : "bg-card-border/40 text-muted"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {loadingData && !profile ? (
            <div className="bg-[#111113] border border-card-border rounded-2xl p-12 text-center space-y-4">
              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-mono text-xs text-muted">SYNCING DATABASE CONTENT...</p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              {activeTab === "profile" && profile && (
                <ProfileHeroTab initialProfile={profile} onSaved={fetchAllData} />
              )}
              {activeTab === "about" && profile && (
                <AboutStatsTab initialProfile={profile} onSaved={fetchAllData} />
              )}
              {activeTab === "skills" && (
                <SkillsTab initialSkills={skills} onSaved={fetchAllData} />
              )}
              {activeTab === "roadmap" && (
                <RoadmapTab initialRoadmap={roadmap} onSaved={fetchAllData} />
              )}
              {activeTab === "projects" && (
                <ProjectsTab initialProjects={projects} onSaved={fetchAllData} />
              )}
              {activeTab === "certifications" && (
                <CertificationsTab
                  initialCertifications={certifications}
                  onSaved={fetchAllData}
                />
              )}
              {activeTab === "experience" && (
                <ExperienceTab
                  initialExperience={experience}
                  onSaved={fetchAllData}
                />
              )}
              {activeTab === "links" && (
                <LinksTab initialLinks={links} onSaved={fetchAllData} />
              )}
              {activeTab === "analytics" && <AnalyticsTab />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
