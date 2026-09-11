"use client";

import { useState } from "react";
import type { Project } from "@/types/database";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import ImageUploader from "./ImageUploader";
import Image from "next/image";

interface ProjectsTabProps {
  initialProjects: Project[];
  onSaved: () => void;
}

export default function ProjectsTab({
  initialProjects,
  onSaved,
}: ProjectsTabProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [briefDetail, setBriefDetail] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [projectUrl, setProjectUrl] = useState("#");
  const [githubUrl, setGithubUrl] = useState("https://github.com/vedabrands/portfolio");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(
    null
  );

  const startEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setBriefDetail(project.brief_detail || "");
    setTagsInput(project.tags.join(", "));
    setImageUrl(project.image_url || "");
    setProjectUrl(project.project_url || "#");
    setGithubUrl(project.github_url || "#");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setBriefDetail("");
    setTagsInput("");
    setImageUrl("");
    setProjectUrl("#");
    setGithubUrl("https://github.com/vedabrands/portfolio");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSaving(true);
    setMessage(null);

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (editingId) {
        // UPDATE
        if (isSupabaseConfigured() && supabase) {
          const { error } = await supabase
            .from("projects")
            .update({
              title: title.trim(),
              description: description.trim(),
              brief_detail: briefDetail.trim() || null,
              tags: tagsArray,
              image_url: imageUrl.trim() || null,
              project_url: projectUrl.trim() || "#",
              github_url: githubUrl.trim() || "#",
            })
            .eq("id", editingId);

          if (error) throw error;
        }

        setProjects(
          projects.map((p) =>
            p.id === editingId
              ? {
                  ...p,
                  title: title.trim(),
                  description: description.trim(),
                  brief_detail: briefDetail.trim() || null,
                  tags: tagsArray,
                  image_url: imageUrl.trim() || null,
                  project_url: projectUrl.trim() || "#",
                  github_url: githubUrl.trim() || "#",
                }
              : p
          )
        );

        setMessage({ text: `Updated project "${title}"!`, type: "success" });
        cancelEdit();
      } else {
        // INSERT
        const nextOrder =
          projects.length > 0
            ? Math.max(...projects.map((p) => p.display_order)) + 1
            : 1;

        if (isSupabaseConfigured() && supabase) {
          const { data, error } = await supabase
            .from("projects")
            .insert({
              title: title.trim(),
              description: description.trim(),
              brief_detail: briefDetail.trim() || null,
              tags: tagsArray,
              image_url: imageUrl.trim() || null,
              project_url: projectUrl.trim() || "#",
              github_url: githubUrl.trim() || "#",
              display_order: nextOrder,
            })
            .select()
            .single();

          if (error) throw error;
          if (data) setProjects([...projects, data]);
        } else {
          const localProject: Project = {
            id: `project-${Date.now()}`,
            title: title.trim(),
            description: description.trim(),
            brief_detail: briefDetail.trim() || null,
            tags: tagsArray,
            image_url: imageUrl.trim() || null,
            project_url: projectUrl.trim() || "#",
            github_url: githubUrl.trim() || "#",
            display_order: nextOrder,
          };
          setProjects([...projects, localProject]);
        }

        setMessage({ text: `Created new project "${title}"!`, type: "success" });
        cancelEdit();
      }

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });

      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save project.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, projectTitle: string) => {
    if (!confirm(`Are you sure you want to delete project "${projectTitle}"?`)) return;

    setSaving(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) throw error;
      }

      setProjects(projects.filter((p) => p.id !== id));

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });

      setMessage({ text: `Deleted project "${projectTitle}"!`, type: "success" });
      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete project.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= projects.length) return;

    const list = [...projects];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const updated = list.map((it, idx) => ({
      ...it,
      display_order: idx + 1,
    }));

    setProjects(updated);

    try {
      if (isSupabaseConfigured() && supabase) {
        for (const it of updated) {
          await supabase
            .from("projects")
            .update({ display_order: it.display_order })
            .eq("id", it.id);
        }
      }
      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });
      onSaved();
    } catch {
      // background error
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl text-foreground">PROJECTS SHOWCASE</h2>
        <p className="font-mono text-xs text-muted mt-1">
          Manage your portfolio projects with dual-side flip detail text, tech tags, direct storage image uploads, and repository links.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border text-xs font-mono flex items-center justify-between ${
            message.type === "success"
              ? "bg-green-950/40 border-green-500/40 text-green-300"
              : "bg-red-950/40 border-red-500/40 text-red-300"
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="text-muted hover:text-foreground font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSave}
        className="bg-[#111113] border border-card-border rounded-2xl p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs text-accent uppercase tracking-wider">
            {editingId ? "// Edit Project" : "// Add New Project"}
          </h3>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-xs font-mono text-muted hover:text-foreground"
            >
              Cancel Edit
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[11px] text-muted uppercase mb-1">
              Project Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AI Content Generator"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-muted uppercase mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Next.js, OpenAI, Tailwind"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[11px] text-muted uppercase mb-1">
              Live Demo / Project URL
            </label>
            <input
              type="text"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-muted uppercase mb-1">
              GitHub Repository URL
            </label>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/..."
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] text-muted uppercase mb-1">
            Front-Card Summary Description
          </label>
          <textarea
            rows={2}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief introductory summary visible on the front face of the project card..."
            className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
          />
        </div>

        <div>
          <label className="block font-mono text-[11px] text-muted uppercase mb-1">
            Back-Card Flip Detail Text (brief_detail)
          </label>
          <textarea
            rows={3}
            value={briefDetail}
            onChange={(e) => setBriefDetail(e.target.value)}
            placeholder="Deep-dive technical breakdown shown when visitors flip or expand the card..."
            className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
          />
        </div>

        {/* Supabase Storage Media Upload */}
        <div className="p-4 bg-[#18181b] border border-card-border rounded-xl">
          <ImageUploader
            currentUrl={imageUrl}
            onUploadComplete={(url) => setImageUrl(url)}
            folder="projects"
            label="Project Cover / Preview Image"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-accent text-background font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
        >
          {saving ? "Saving..." : editingId ? "Update Project" : "+ Create Project"}
        </button>
      </form>

      {/* Projects List */}
      <div className="bg-[#111113] border border-card-border rounded-2xl p-6 space-y-4">
        <h3 className="font-mono text-xs text-accent uppercase tracking-wider">
          {"//"} All Projects ({projects.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project, idx) => (
            <div
              key={project.id}
              className="bg-[#18181b] border border-card-border rounded-xl p-5 space-y-3 relative group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-accent font-semibold">
                    #{idx + 1}
                  </span>
                  <h4 className="font-display text-lg text-foreground">{project.title}</h4>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, "up")}
                    className="p-1 bg-[#111113] border border-card-border rounded text-[11px] text-muted hover:border-accent disabled:opacity-30"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={idx === projects.length - 1}
                    onClick={() => handleMove(idx, "down")}
                    className="p-1 bg-[#111113] border border-card-border rounded text-[11px] text-muted hover:border-accent disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(project)}
                    className="px-2 py-1 bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 rounded text-[11px] font-mono"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project.id, project.title)}
                    className="px-2 py-1 bg-red-950/30 border border-red-500/30 text-red-400 hover:bg-red-950/60 rounded text-[11px] font-mono"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {project.image_url && (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-card-border bg-black/40">
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              <p className="text-xs text-muted font-mono leading-relaxed line-clamp-2">
                {project.description}
              </p>

              {project.brief_detail && (
                <p className="text-[11px] text-accent/80 font-mono italic line-clamp-1 border-l-2 border-accent/50 pl-2">
                  Flip Detail: {project.brief_detail}
                </p>
              )}

              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.tags.map((t, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded bg-card-border/40 text-[10px] font-mono text-muted"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
