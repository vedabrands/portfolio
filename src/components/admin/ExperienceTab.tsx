"use client";

import { useState } from "react";
import type { Experience } from "@/types/database";
import { supabase } from "@/lib/supabase";

interface ExperienceTabProps {
  initialExperience: Experience[];
  onSaved: () => void;
}

export default function ExperienceTab({
  initialExperience,
  onSaved,
}: ExperienceTabProps) {
  const [items, setItems] = useState<Experience[]>(initialExperience);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("Present");
  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(
    null
  );

  const startEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setRole(exp.role);
    setCompany(exp.company);
    setStartDate(exp.start_date);
    setEndDate(exp.end_date || "Present");
    setDescription(exp.description || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setRole("");
    setCompany("");
    setStartDate("");
    setEndDate("Present");
    setDescription("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim() || !company.trim()) return;

    setSaving(true);
    setMessage(null);

    try {
      if (!supabase) throw new Error("Supabase is not configured.");

      if (editingId) {
        // UPDATE
        const { error } = await supabase
          .from("experience")
          .update({
            role: role.trim(),
            company: company.trim(),
            start_date: startDate.trim(),
            end_date: endDate.trim() || "Present",
            description: description.trim() || null,
          })
          .eq("id", editingId);

        if (error) throw error;

        setItems(
          items.map((it) =>
            it.id === editingId
              ? {
                  ...it,
                  role: role.trim(),
                  company: company.trim(),
                  start_date: startDate.trim(),
                  end_date: endDate.trim() || "Present",
                  description: description.trim() || null,
                }
              : it
          )
        );

        setMessage({ text: `Updated experience "${role} at ${company}"!`, type: "success" });
        cancelEdit();
      } else {
        // INSERT
        const nextOrder =
          items.length > 0
            ? Math.max(...items.map((it) => it.display_order)) + 1
            : 1;

        const { data, error } = await supabase
          .from("experience")
          .insert({
            role: role.trim(),
            company: company.trim(),
            start_date: startDate.trim() || "2023",
            end_date: endDate.trim() || "Present",
            description: description.trim() || null,
            display_order: nextOrder,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setItems([...items, data]);

        setMessage({ text: `Added experience "${role} at ${company}"!`, type: "success" });
        cancelEdit();
      }

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });

      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save experience.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, roleName: string) => {
    if (!confirm(`Are you sure you want to delete "${roleName}"?`)) return;

    setSaving(true);
    try {
      if (!supabase) throw new Error("Supabase is not configured.");

      const { error } = await supabase.from("experience").delete().eq("id", id);
      if (error) throw error;

      setItems(items.filter((it) => it.id !== id));

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });

      setMessage({ text: `Deleted "${roleName}"!`, type: "success" });
      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete experience.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const list = [...items];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const updated = list.map((it, idx) => ({
      ...it,
      display_order: idx + 1,
    }));

    setItems(updated);

    try {
      if (!supabase) throw new Error("Supabase is not configured.");
      for (const it of updated) {
        await supabase
          .from("experience")
          .update({ display_order: it.display_order })
          .eq("id", it.id);
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
        <h2 className="font-display text-2xl text-foreground">WORK & CAREER EXPERIENCE</h2>
        <p className="font-mono text-xs text-muted mt-1">
          Manage your job history, engineering positions, and milestones.
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

      {/* Form */}
      <form
        onSubmit={handleSave}
        className="bg-[#111113] border border-card-border rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs text-accent uppercase tracking-wider">
            {editingId ? "// Edit Role" : "// Add Career Role"}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[11px] text-muted uppercase mb-1">
              Role / Position
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Full-Stack & AI Engineer"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-muted uppercase mb-1">
              Company / Organization
            </label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Veda Brands"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[11px] text-muted uppercase mb-1">
              Start Date
            </label>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="e.g. 2023 or Jan 2023"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-muted uppercase mb-1">
              End Date
            </label>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="e.g. Present or 2024"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] text-muted uppercase mb-1">
            Impact & Responsibilities Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Architecting generative AI interfaces, scalable full-stack web applications..."
            className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-accent text-background font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
        >
          {saving ? "Saving..." : editingId ? "Update Experience" : "+ Add Experience"}
        </button>
      </form>

      {/* Experience List */}
      <div className="bg-[#111113] border border-card-border rounded-2xl p-6 space-y-4">
        <h3 className="font-mono text-xs text-accent uppercase tracking-wider">
          {"//"} Career History ({items.length})
        </h3>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="bg-[#18181b] border border-card-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-accent font-semibold">
                    #{idx + 1}
                  </span>
                  <h4 className="font-display text-base text-foreground">{item.role}</h4>
                </div>
                <p className="font-mono text-xs text-muted mt-0.5">
                  {item.company} • {item.start_date} – {item.end_date}
                </p>
                {item.description && (
                  <p className="font-mono text-xs text-muted/80 mt-1 line-clamp-1">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 self-end sm:self-auto">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, "up")}
                  className="p-1.5 bg-[#111113] border border-card-border rounded text-xs text-muted hover:border-accent disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={idx === items.length - 1}
                  onClick={() => handleMove(idx, "down")}
                  className="p-1.5 bg-[#111113] border border-card-border rounded text-xs text-muted hover:border-accent disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="px-2.5 py-1.5 bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 rounded text-xs font-mono"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.role)}
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
