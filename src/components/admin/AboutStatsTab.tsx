"use client";

import { useState } from "react";
import type { Profile, StatsData } from "@/types/database";
import { supabase } from "@/lib/supabase";

interface AboutStatsTabProps {
  initialProfile: Profile | null;
  onSaved: () => void;
}

interface StatEntry {
  key: string;
  label: string;
  value: string;
}

export default function AboutStatsTab({
  initialProfile,
  onSaved,
}: AboutStatsTabProps) {
  const [bio, setBio] = useState(initialProfile?.bio || "");
  const [statsList, setStatsList] = useState<StatEntry[]>(() => {
    const rawStats = initialProfile?.stats || {};
    const defaultLabels: Record<string, string> = {
      years_experience: "Years Experience",
      projects_completed: "Projects Completed",
      happy_clients: "Happy Clients",
      certifications_count: "Certifications",
    };

    const entries = Object.entries(rawStats).map(([key, val]) => ({
      key,
      label: defaultLabels[key] || key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
      value: String(val || ""),
    }));

    if (entries.length === 0) {
      return [
        { key: "years_experience", label: "Years Experience", value: "5+" },
        { key: "projects_completed", label: "Projects Completed", value: "50+" },
        { key: "happy_clients", label: "Happy Clients", value: "30+" },
        { key: "certifications_count", label: "Certifications", value: "10+" },
      ];
    }
    return entries;
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(
    null
  );

  const handleAddStat = () => {
    setStatsList([
      ...statsList,
      {
        key: `custom_stat_${Date.now()}`,
        label: "New Metric",
        value: "100+",
      },
    ]);
  };

  const handleRemoveStat = (index: number) => {
    setStatsList(statsList.filter((_, idx) => idx !== index));
  };

  const handleUpdateStat = (index: number, field: "label" | "value", value: string) => {
    const updated = [...statsList];
    updated[index] = { ...updated[index], [field]: value };
    // update key based on label
    if (field === "label") {
      updated[index].key = value.toLowerCase().replace(/[^a-z0-9]/g, "_");
    }
    setStatsList(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (!supabase) throw new Error("Supabase is not configured.");

      // Build stats object
      const statsObj: StatsData = {};
      statsList.forEach((item) => {
        const k = item.key || item.label.toLowerCase().replace(/[^a-z0-9]/g, "_");
        statsObj[k] = item.value;
      });

      if (initialProfile?.id) {
        const { error } = await supabase
          .from("profile")
          .update({
            bio,
            stats: statsObj,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialProfile.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("profile").insert({
          name: "Your Name",
          title: "Creative Developer & AI/Vision Engineer",
          bio,
          stats: statsObj,
          hero_headlines: [],
        });
        if (error) throw error;
      }

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });

      setMessage({ text: "About bio & stats successfully updated and revalidated!", type: "success" });
      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save data.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl text-foreground">ABOUT & STATS METRICS</h2>
        <p className="font-mono text-xs text-muted mt-1">
          Manage your bio statement, narrative text paragraphs, and key visual counter metrics.
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
        {/* Bio Text Card */}
        <div className="bg-[#111113] border border-card-border rounded-2xl p-6 space-y-4">
          <h3 className="font-mono text-xs text-accent uppercase tracking-wider">
            {"//"} About Me Narrative
          </h3>
          <p className="font-mono text-[11px] text-muted">
            Supports multi-paragraph text. This renders on the left side of the About section.
          </p>

          <textarea
            rows={6}
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Write your comprehensive background and engineering philosophy..."
            className="w-full px-4 py-3 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm focus:outline-none focus:border-accent leading-relaxed font-sans"
          />
        </div>

        {/* Stats List Card */}
        <div className="bg-[#111113] border border-card-border rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-mono text-xs text-accent uppercase tracking-wider">
                {"//"} Impact Metrics & Counter Stats
              </h3>
              <p className="font-mono text-[11px] text-muted mt-0.5">
                Displayed in the 2x2 animated glowing stat cards. Add, delete, or modify values.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddStat}
              className="px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 rounded-lg font-mono text-xs transition-colors"
            >
              + Add Metric Card
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {statsList.map((stat, idx) => (
              <div
                key={idx}
                className="bg-[#18181b] border border-card-border rounded-xl p-4 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-accent">
                    CARD #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStat(idx)}
                    className="font-mono text-xs text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-muted uppercase mb-1">
                    Value / Metric (e.g. &quot;5+&quot;, &quot;50+&quot;)
                  </label>
                  <input
                    type="text"
                    required
                    value={stat.value}
                    onChange={(e) => handleUpdateStat(idx, "value", e.target.value)}
                    className="w-full px-3 py-2 bg-[#111113] border border-card-border rounded-lg text-foreground text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-muted uppercase mb-1">
                    Label (e.g. &quot;Years Experience&quot;)
                  </label>
                  <input
                    type="text"
                    required
                    value={stat.label}
                    onChange={(e) => handleUpdateStat(idx, "label", e.target.value)}
                    className="w-full px-3 py-2 bg-[#111113] border border-card-border rounded-lg text-foreground text-xs font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-accent to-[#b88528] text-background font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
        >
          {saving ? "Saving Changes..." : "Save About & Stats"}
        </button>
      </form>
    </div>
  );
}
