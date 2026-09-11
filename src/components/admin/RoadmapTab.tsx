"use client";

import { useState } from "react";
import type { RoadmapItem } from "@/types/database";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface RoadmapTabProps {
  initialRoadmap: RoadmapItem[];
  onSaved: () => void;
}

export default function RoadmapTab({
  initialRoadmap,
  onSaved,
}: RoadmapTabProps) {
  const [items, setItems] = useState<RoadmapItem[]>(initialRoadmap);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for Add / Edit
  const [label, setLabel] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(
    null
  );

  const startEdit = (item: RoadmapItem) => {
    setEditingId(item.id);
    setLabel(item.label || "");
    setTitle(item.title);
    setDescription(item.description);
    setTag(item.tag || item.tech || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setLabel("");
    setTitle("");
    setDescription("");
    setTag("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSaving(true);
    setMessage(null);

    try {
      if (editingId) {
        // UPDATE
        if (isSupabaseConfigured() && supabase) {
          const { error } = await supabase
            .from("roadmap")
            .update({
              label: label.trim() || null,
              title: title.trim(),
              description: description.trim(),
              tag: tag.trim() || null,
              tech: tag.trim() || null,
            })
            .eq("id", editingId);

          if (error) throw error;
        }

        setItems(
          items.map((it) =>
            it.id === editingId
              ? {
                  ...it,
                  label: label.trim() || null,
                  title: title.trim(),
                  description: description.trim(),
                  tag: tag.trim() || null,
                  tech: tag.trim() || null,
                }
              : it
          )
        );
        setMessage({ text: `Updated roadmap track "${title}"!`, type: "success" });
        cancelEdit();
      } else {
        // INSERT
        const nextOrder =
          items.length > 0
            ? Math.max(...items.map((it) => it.display_order)) + 1
            : 1;

        const autoLabel = label.trim() || `ROOT 0${items.length + 1}`;

        if (isSupabaseConfigured() && supabase) {
          const { data, error } = await supabase
            .from("roadmap")
            .insert({
              label: autoLabel,
              title: title.trim(),
              description: description.trim(),
              tag: tag.trim() || null,
              tech: tag.trim() || null,
              display_order: nextOrder,
            })
            .select()
            .single();

          if (error) throw error;
          if (data) setItems([...items, data]);
        } else {
          const localItem: RoadmapItem = {
            id: `roadmap-${Date.now()}`,
            label: autoLabel,
            title: title.trim(),
            description: description.trim(),
            tag: tag.trim() || null,
            tech: tag.trim() || null,
            display_order: nextOrder,
          };
          setItems([...items, localItem]);
        }

        setMessage({ text: `Added roadmap track "${title}"!`, type: "success" });
        cancelEdit();
      }

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });

      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save roadmap track.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!confirm(`Are you sure you want to delete roadmap track "${itemTitle}"?`)) return;

    setSaving(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.from("roadmap").delete().eq("id", id);
        if (error) throw error;
      }

      setItems(items.filter((it) => it.id !== id));

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });

      setMessage({ text: `Deleted roadmap track "${itemTitle}"!`, type: "success" });
      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete track.";
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
      if (isSupabaseConfigured() && supabase) {
        for (const it of updated) {
          await supabase
            .from("roadmap")
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
        <h2 className="font-display text-2xl text-foreground">ROADMAP / ROOT MAP CARDS</h2>
        <p className="font-mono text-xs text-muted mt-1">
          Manage the 4 core execution tracks with interactive connecting Bézier wave and traveling glow animation.
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
        className="bg-[#111113] border border-card-border rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs text-accent uppercase tracking-wider">
            {editingId ? "// Edit Roadmap Track" : "// Add New Roadmap Track"}
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block font-mono text-[11px] text-muted uppercase mb-1">
              Label (e.g. &quot;ROOT 01&quot;)
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. ROOT 01"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-muted uppercase mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Frontend Development"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-muted uppercase mb-1">
              Tag / Tech
            </label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g. React & Tailwind"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] text-muted uppercase mb-1">
            Description
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Architecting responsive, high-performance UI components..."
            className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-accent text-background font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
        >
          {saving
            ? "Saving..."
            : editingId
            ? "Update Roadmap Track"
            : "+ Add Roadmap Track"}
        </button>
      </form>

      {/* List of Tracks */}
      <div className="bg-[#111113] border border-card-border rounded-2xl p-6 space-y-4">
        <h3 className="font-mono text-xs text-accent uppercase tracking-wider">
          {"//"} Current Roadmap Tracks ({items.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="bg-[#18181b] border border-card-border rounded-xl p-5 space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-accent font-semibold">
                  {item.label || `ROOT 0${idx + 1}`}
                </span>
                <div className="flex items-center gap-1.5">
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
                    disabled={idx === items.length - 1}
                    onClick={() => handleMove(idx, "down")}
                    className="p-1 bg-[#111113] border border-card-border rounded text-[11px] text-muted hover:border-accent disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="px-2 py-1 bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 rounded text-[11px] font-mono"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.title)}
                    className="px-2 py-1 bg-red-950/30 border border-red-500/30 text-red-400 hover:bg-red-950/60 rounded text-[11px] font-mono"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <h4 className="font-display text-lg text-foreground">{item.title}</h4>
              <p className="text-xs text-muted font-mono leading-relaxed">
                {item.description}
              </p>

              {(item.tag || item.tech) && (
                <div className="pt-1">
                  <span className="inline-block px-2.5 py-1 rounded bg-card-border/40 text-[10px] font-mono text-accent">
                    {item.tag || item.tech}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
