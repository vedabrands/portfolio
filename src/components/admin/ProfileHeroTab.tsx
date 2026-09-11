"use client";

import { useState } from "react";
import type { Profile, HeadlineItem } from "@/types/database";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface ProfileHeroTabProps {
  initialProfile: Profile | null;
  onSaved: () => void;
}

export default function ProfileHeroTab({
  initialProfile,
  onSaved,
}: ProfileHeroTabProps) {
  const [profileId, setProfileId] = useState<string>(initialProfile?.id || "");
  const [name, setName] = useState(initialProfile?.name || "");
  const [title, setTitle] = useState(initialProfile?.title || "");
  const [headlines, setHeadlines] = useState<HeadlineItem[]>(
    initialProfile?.hero_headlines && initialProfile.hero_headlines.length > 0
      ? initialProfile.hero_headlines
      : [
          {
            eyebrow: "Hi, I'm Your Name",
            lines: ["Creative", "Developer"],
            fontSize:
              "text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.75rem] 2xl:text-[6.5rem]",
            lineHeight: "leading-[0.92]",
            tagline: "// Turning Ideas Into Reality",
            desc: "Available for hire. Building fast, responsive web applications using modern tech stacks.",
          },
        ]
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(
    null
  );

  const handleAddHeadline = () => {
    setHeadlines([
      ...headlines,
      {
        eyebrow: "Specialization Tag",
        lines: ["New", "Headline"],
        fontSize:
          "text-5xl sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.75rem] 2xl:text-[6.5rem]",
        lineHeight: "leading-[0.92]",
        tagline: "// Engineering Excellence",
        desc: "New sector description.",
      },
    ]);
  };

  const handleRemoveHeadline = (index: number) => {
    setHeadlines(headlines.filter((_, idx) => idx !== index));
  };

  const handleUpdateHeadline = (
    index: number,
    field: keyof HeadlineItem,
    value: string | string[]
  ) => {
    const updated = [...headlines];
    updated[index] = { ...updated[index], [field]: value };
    setHeadlines(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        name,
        title,
        hero_headlines: headlines,
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured() && supabase) {
        if (profileId) {
          const { error } = await supabase
            .from("profile")
            .update(payload)
            .eq("id", profileId);
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from("profile")
            .insert({
              ...payload,
              bio: initialProfile?.bio || "Creative Developer bio.",
              stats: initialProfile?.stats || {},
            })
            .select()
            .single();
          if (error) throw error;
          if (data) setProfileId(data.id);
        }
      }

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });

      setMessage({ text: "Profile and Hero sections saved and revalidated live!", type: "success" });
      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save profile.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl text-foreground">PROFILE & HERO SETTINGS</h2>
        <p className="font-mono text-xs text-muted mt-1">
          Customize your display name, primary professional title, and the rotating hero headline sets.
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

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Profile Card */}
        <div className="bg-[#111113] border border-card-border rounded-2xl p-6 space-y-5">
          <h3 className="font-mono text-xs text-accent uppercase tracking-wider">
            {"//"} Core Identity
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                Display Name (Navbar & Hero)
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Your Name"
                className="w-full px-4 py-3 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-muted uppercase tracking-wider mb-2">
                Sub-Title / Role Tag
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Creative Developer & AI/Vision Engineer"
                className="w-full px-4 py-3 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>

        {/* Hero Headlines List */}
        <div className="bg-[#111113] border border-card-border rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-mono text-xs text-accent uppercase tracking-wider">
                {"//"} Rotating Hero Headlines & Sectors
              </h3>
              <p className="font-mono text-[11px] text-muted mt-0.5">
                Each item represents an interactive sector with custom eyebrow label, multi-line title, tagline, and description.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddHeadline}
              className="px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 rounded-lg font-mono text-xs transition-colors"
            >
              + Add Headline Phrase
            </button>
          </div>

          <div className="space-y-6">
            {headlines.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#18181b] border border-card-border/80 rounded-xl p-5 space-y-4 relative group"
              >
                <div className="flex items-center justify-between border-b border-card-border/50 pb-3">
                  <span className="font-mono text-xs text-accent font-semibold">
                    PHRASE #{idx + 1}
                  </span>
                  {headlines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveHeadline(idx)}
                      className="font-mono text-xs text-red-400 hover:text-red-300"
                    >
                      Delete Phrase
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[11px] text-muted uppercase mb-1">
                      Eyebrow Tag (e.g. &quot;Hi, I&apos;m Your Name&quot;)
                    </label>
                    <input
                      type="text"
                      value={item.eyebrow}
                      onChange={(e) =>
                        handleUpdateHeadline(idx, "eyebrow", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-[#111113] border border-card-border rounded-lg text-foreground text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-muted uppercase mb-1">
                      Headline Lines (comma separated, e.g. &quot;Creative, Developer&quot;)
                    </label>
                    <input
                      type="text"
                      value={item.lines.join(", ")}
                      onChange={(e) =>
                        handleUpdateHeadline(
                          idx,
                          "lines",
                          e.target.value.split(",").map((s) => s.trim())
                        )
                      }
                      className="w-full px-3 py-2 bg-[#111113] border border-card-border rounded-lg text-foreground text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-[11px] text-muted uppercase mb-1">
                      Tagline / Code Comment (e.g. &quot;// Turning Ideas Into Reality&quot;)
                    </label>
                    <input
                      type="text"
                      value={item.tagline}
                      onChange={(e) =>
                        handleUpdateHeadline(idx, "tagline", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-[#111113] border border-card-border rounded-lg text-foreground text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] text-muted uppercase mb-1">
                      Hero Description Text Block
                    </label>
                    <textarea
                      rows={2}
                      value={item.desc}
                      onChange={(e) =>
                        handleUpdateHeadline(idx, "desc", e.target.value)
                      }
                      className="w-full px-3 py-2 bg-[#111113] border border-card-border rounded-lg text-foreground text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-accent to-[#b88528] text-background font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-98 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? "Saving Changes..." : "Save Profile & Hero"}
        </button>
      </form>
    </div>
  );
}
