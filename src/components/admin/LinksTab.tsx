"use client";

import { useState } from "react";
import type { LinkItem } from "@/types/database";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface LinksTabProps {
  initialLinks: LinkItem[];
  onSaved: () => void;
}

export default function LinksTab({
  initialLinks,
  onSaved,
}: LinksTabProps) {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [iconName, setIconName] = useState("nav");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(
    null
  );

  const startEdit = (item: LinkItem) => {
    setEditingId(item.id);
    setLabel(item.label);
    setUrl(item.url);
    setIconName(item.icon_name || "nav");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setLabel("");
    setUrl("");
    setIconName("nav");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !url.trim()) return;

    setSaving(true);
    setMessage(null);

    try {
      if (isSupabaseConfigured() && supabase) {
        if (editingId) {
          // UPDATE
          const { error } = await supabase
            .from("links")
            .update({
              label: label.trim(),
              url: url.trim(),
              icon_name: iconName.trim() || null,
            })
            .eq("id", editingId);

          if (error) throw error;
        } else {
          // INSERT
          const nextOrder =
            links.length > 0
              ? Math.max(...links.map((it) => it.display_order)) + 1
              : 1;

          const { data, error } = await supabase
            .from("links")
            .insert({
              label: label.trim(),
              url: url.trim(),
              icon_name: iconName.trim() || null,
              display_order: nextOrder,
            })
            .select()
            .single();

          if (error) throw error;
          if (data) {
            setLinks([...links, data]);
            setMessage({ text: `Added link "${label}"!`, type: "success" });
            cancelEdit();
            await fetch("/api/revalidate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ path: "/" }),
            });
            onSaved();
            return;
          }
        }
      }

      if (editingId) {
        setLinks(
          links.map((it) =>
            it.id === editingId
              ? {
                  ...it,
                  label: label.trim(),
                  url: url.trim(),
                  icon_name: iconName.trim() || null,
                }
              : it
          )
        );
        setMessage({ text: `Updated link "${label}"!`, type: "success" });
        cancelEdit();
      } else {
        const nextOrder =
          links.length > 0
            ? Math.max(...links.map((it) => it.display_order)) + 1
            : 1;
        const newLocalItem: LinkItem = {
          id: `link-${Date.now()}`,
          label: label.trim(),
          url: url.trim(),
          icon_name: iconName.trim() || null,
          display_order: nextOrder,
        };
        setLinks([...links, newLocalItem]);
        setMessage({ text: `Added link "${label}"!`, type: "success" });
        cancelEdit();
      }

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });

      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save link.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, linkName: string) => {
    if (!confirm(`Are you sure you want to delete "${linkName}"?`)) return;

    setSaving(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { error } = await supabase.from("links").delete().eq("id", id);
        if (error) throw error;
      }

      setLinks(links.filter((it) => it.id !== id));

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });

      setMessage({ text: `Deleted "${linkName}"!`, type: "success" });
      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete link.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= links.length) return;

    const list = [...links];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const updated = list.map((it, idx) => ({
      ...it,
      display_order: idx + 1,
    }));

    setLinks(updated);

    try {
      if (!supabase) throw new Error("Supabase is not configured.");
      for (const it of updated) {
        await supabase
          .from("links")
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
        <h2 className="font-display text-2xl text-foreground">LINKS & SOCIAL CONNECTIONS</h2>
        <p className="font-mono text-xs text-muted mt-1">
          Manage header navigation anchors and footer contact links (GitHub, LinkedIn, Twitter, Email).
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
            {editingId ? "// Edit Link" : "// Add New Link / Social"}
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
              Label (e.g. &quot;GitHub&quot;, &quot;LinkedIn&quot;)
            </label>
            <input
              type="text"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. GitHub"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-muted uppercase mb-1">
              Destination URL or Anchor
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://... or #projects"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-muted uppercase mb-1">
              Icon Type
            </label>
            <select
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
            >
              <option value="mail">Email (mail)</option>
              <option value="github">GitHub (github)</option>
              <option value="linkedin">LinkedIn (linkedin)</option>
              <option value="twitter">Twitter / X (twitter)</option>
              <option value="nav">Navigation Anchor (nav)</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-accent text-background font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
        >
          {saving ? "Saving..." : editingId ? "Update Link" : "+ Add Link"}
        </button>
      </form>

      {/* Links List */}
      <div className="bg-[#111113] border border-card-border rounded-2xl p-6 space-y-4">
        <h3 className="font-mono text-xs text-accent uppercase tracking-wider">
          {"//"} Current Navigation & Social Links ({links.length})
        </h3>

        <div className="space-y-3">
          {links.map((item, idx) => (
            <div
              key={item.id}
              className="bg-[#18181b] border border-card-border rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-accent font-semibold">
                  #{idx + 1}
                </span>
                <div>
                  <span className="font-display text-base text-foreground mr-2">
                    {item.label}
                  </span>
                  <span className="font-mono text-[10px] text-muted px-2 py-0.5 bg-card-border/40 rounded">
                    {item.icon_name || "nav"}
                  </span>
                  <p className="font-mono text-xs text-muted/70 mt-0.5">
                    {item.url}
                  </p>
                </div>
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
                  disabled={idx === links.length - 1}
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
                  onClick={() => handleDelete(item.id, item.label)}
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
