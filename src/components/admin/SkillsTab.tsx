"use client";

import { useState } from "react";
import type { Skill } from "@/types/database";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface SkillsTabProps {
  initialSkills: Skill[];
  onSaved: () => void;
}

export default function SkillsTab({
  initialSkills,
  onSaved,
}: SkillsTabProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("AI & Machine Learning");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(
    null
  );

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setSaving(true);
    setMessage(null);

    const newOrder =
      skills.length > 0
        ? Math.max(...skills.map((s) => s.display_order)) + 1
        : 1;

    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from("skills")
          .insert({
            name: newSkillName.trim(),
            category: newSkillCategory.trim(),
            display_order: newOrder,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setSkills([...skills, data]);
      } else {
        const localSkill: Skill = {
          id: `skill-${Date.now()}`,
          name: newSkillName.trim(),
          category: newSkillCategory.trim(),
          display_order: newOrder,
        };
        setSkills([...skills, localSkill]);
      }

      setNewSkillName("");

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });

      setMessage({ text: `Added skill "${newSkillName}"!`, type: "success" });
      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add skill.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSkill = async (skill: Skill, updatedName: string, updatedCategory: string) => {
    setSaving(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase
          .from("skills")
          .update({
            name: updatedName,
            category: updatedCategory,
          })
          .eq("id", skill.id);

        if (error) throw error;
      }

      setSkills(
        skills.map((s) =>
          s.id === skill.id
            ? { ...s, name: updatedName, category: updatedCategory }
            : s
        )
      );

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });

      setMessage({ text: `Updated skill "${updatedName}"!`, type: "success" });
      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update skill.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete skill "${name}"?`)) return;

    setSaving(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.from("skills").delete().eq("id", id);
        if (error) throw error;
      }

      setSkills(skills.filter((s) => s.id !== id));

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });

      setMessage({ text: `Deleted skill "${name}"!`, type: "success" });
      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete skill.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= skills.length) return;

    const list = [...skills];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // Reassign order
    const updated = list.map((item, idx) => ({
      ...item,
      display_order: idx + 1,
    }));

    setSkills(updated);

    try {
      if (isSupabaseConfigured() && supabase) {
        for (const item of updated) {
          await supabase
            .from("skills")
            .update({ display_order: item.display_order })
            .eq("id", item.id);
        }
      }

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });
      onSaved();
    } catch {
      // Ignore background reorder errors
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl text-foreground">SKILLS & EXPERTISE PILLS</h2>
        <p className="font-mono text-xs text-muted mt-1">
          Manage the interactive scrolling marquee pills rendered across the Skills section.
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

      {/* Add New Skill Form */}
      <form
        onSubmit={handleAddSkill}
        className="bg-[#111113] border border-card-border rounded-2xl p-6 space-y-4"
      >
        <h3 className="font-mono text-xs text-accent uppercase tracking-wider">
          {"//"} Add New Skill Pill
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block font-mono text-[11px] text-muted uppercase mb-1">
              Skill Name
            </label>
            <input
              type="text"
              required
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g. Next.js, PyTorch, RAG Pipelines"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-muted uppercase mb-1">
              Category
            </label>
            <input
              type="text"
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value)}
              placeholder="e.g. AI & Machine Learning"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-accent text-background font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
        >
          {saving ? "Adding..." : "+ Add Skill"}
        </button>
      </form>

      {/* Current Skills List */}
      <div className="bg-[#111113] border border-card-border rounded-2xl p-6 space-y-4">
        <h3 className="font-mono text-xs text-accent uppercase tracking-wider">
          {"//"} Current Skills ({skills.length})
        </h3>

        <div className="divide-y divide-card-border/60">
          {skills.map((skill, idx) => (
            <div
              key={skill.id}
              className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-muted w-6">
                  #{idx + 1}
                </span>
                <input
                  type="text"
                  defaultValue={skill.name}
                  onBlur={(e) => {
                    if (e.target.value !== skill.name) {
                      handleUpdateSkill(skill, e.target.value, skill.category);
                    }
                  }}
                  className="px-3 py-1.5 bg-[#18181b] border border-card-border rounded-lg text-foreground text-xs font-mono focus:border-accent focus:outline-none w-48"
                />
                <span className="font-mono text-[10px] text-muted/70 px-2 py-1 bg-card-border/30 rounded">
                  {skill.category}
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, "up")}
                  className="p-1.5 bg-[#18181b] border border-card-border rounded hover:border-accent disabled:opacity-30 text-xs text-muted"
                  title="Move Up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={idx === skills.length - 1}
                  onClick={() => handleMove(idx, "down")}
                  className="p-1.5 bg-[#18181b] border border-card-border rounded hover:border-accent disabled:opacity-30 text-xs text-muted"
                  title="Move Down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSkill(skill.id, skill.name)}
                  className="px-2.5 py-1.5 bg-red-950/30 border border-red-500/30 text-red-400 hover:bg-red-950/60 rounded text-xs font-mono"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
