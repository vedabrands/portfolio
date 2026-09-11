"use client";

import { useState } from "react";
import type { Certification } from "@/types/database";
import { supabase } from "@/lib/supabase";
import ImageUploader from "./ImageUploader";
import Image from "next/image";

interface CertificationsTabProps {
  initialCertifications: Certification[];
  onSaved: () => void;
}

export default function CertificationsTab({
  initialCertifications,
  onSaved,
}: CertificationsTabProps) {
  const [certs, setCerts] = useState<Certification[]>(initialCertifications);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [dateIssued, setDateIssued] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(
    null
  );

  const startEdit = (cert: Certification) => {
    setEditingId(cert.id);
    setTitle(cert.title);
    setIssuer(cert.issuer);
    setDateIssued(cert.date_issued);
    setDescription(cert.description || "");
    setImageUrl(cert.image_url || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setIssuer("");
    setDateIssued("");
    setDescription("");
    setImageUrl("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim()) return;

    setSaving(true);
    setMessage(null);

    try {
      if (!supabase) throw new Error("Supabase is not configured.");

      if (editingId) {
        // UPDATE
        const { error } = await supabase
          .from("certifications")
          .update({
            title: title.trim(),
            issuer: issuer.trim(),
            date_issued: dateIssued.trim(),
            description: description.trim() || null,
            image_url: imageUrl.trim() || null,
          })
          .eq("id", editingId);

        if (error) throw error;

        setCerts(
          certs.map((c) =>
            c.id === editingId
              ? {
                  ...c,
                  title: title.trim(),
                  issuer: issuer.trim(),
                  date_issued: dateIssued.trim(),
                  description: description.trim() || null,
                  image_url: imageUrl.trim() || null,
                }
              : c
          )
        );

        setMessage({ text: `Updated certification "${title}"!`, type: "success" });
        cancelEdit();
      } else {
        // INSERT
        const nextOrder =
          certs.length > 0
            ? Math.max(...certs.map((c) => c.display_order)) + 1
            : 1;

        const { data, error } = await supabase
          .from("certifications")
          .insert({
            title: title.trim(),
            issuer: issuer.trim(),
            date_issued: dateIssued.trim() || "2024",
            description: description.trim() || null,
            image_url: imageUrl.trim() || null,
            display_order: nextOrder,
          })
          .select()
          .single();

        if (error) throw error;
        if (data) setCerts([...certs, data]);

        setMessage({ text: `Added certification "${title}"!`, type: "success" });
        cancelEdit();
      }

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });

      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save certification.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, certTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${certTitle}"?`)) return;

    setSaving(true);
    try {
      if (!supabase) throw new Error("Supabase is not configured.");

      const { error } = await supabase
        .from("certifications")
        .delete()
        .eq("id", id);
      if (error) throw error;

      setCerts(certs.filter((c) => c.id !== id));

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });

      setMessage({ text: `Deleted certification "${certTitle}"!`, type: "success" });
      onSaved();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete.";
      setMessage({ text: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= certs.length) return;

    const list = [...certs];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    const updated = list.map((it, idx) => ({
      ...it,
      display_order: idx + 1,
    }));

    setCerts(updated);

    try {
      if (!supabase) throw new Error("Supabase is not configured.");
      for (const it of updated) {
        await supabase
          .from("certifications")
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
        <h2 className="font-display text-2xl text-foreground">CERTIFICATIONS & ACCREDITATIONS</h2>
        <p className="font-mono text-xs text-muted mt-1">
          Manage professional certifications, credential badges, and issuer credentials.
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
            {editingId ? "// Edit Certification" : "// Add Certification"}
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
              Certification Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AWS Solutions Architect"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-muted uppercase mb-1">
              Issuer
            </label>
            <input
              type="text"
              required
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="e.g. Amazon Web Services, Google"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-muted uppercase mb-1">
              Date Issued
            </label>
            <input
              type="text"
              value={dateIssued}
              onChange={(e) => setDateIssued(e.target.value)}
              placeholder="e.g. 2024"
              className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] text-muted uppercase mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Credential domain coverage and skills verified..."
            className="w-full px-4 py-2.5 bg-[#18181b] border border-card-border rounded-xl text-foreground text-sm font-mono focus:border-accent"
          />
        </div>

        <div className="p-4 bg-[#18181b] border border-card-border rounded-xl">
          <ImageUploader
            currentUrl={imageUrl}
            onUploadComplete={(url) => setImageUrl(url)}
            folder="certifications"
            label="Certification Badge Image (Optional)"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-accent text-background font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
        >
          {saving ? "Saving..." : editingId ? "Update Certification" : "+ Add Certification"}
        </button>
      </form>

      {/* Certifications List */}
      <div className="bg-[#111113] border border-card-border rounded-2xl p-6 space-y-4">
        <h3 className="font-mono text-xs text-accent uppercase tracking-wider">
          {"//"} All Certifications ({certs.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certs.map((cert, idx) => (
            <div
              key={cert.id}
              className="bg-[#18181b] border border-card-border rounded-xl p-5 space-y-2.5 relative group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-accent font-semibold">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-display text-base text-foreground">{cert.title}</h4>
                    <p className="font-mono text-[11px] text-muted">{cert.issuer} • {cert.date_issued}</p>
                  </div>
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
                    disabled={idx === certs.length - 1}
                    onClick={() => handleMove(idx, "down")}
                    className="p-1 bg-[#111113] border border-card-border rounded text-[11px] text-muted hover:border-accent disabled:opacity-30"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(cert)}
                    className="px-2 py-1 bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 rounded text-[11px] font-mono"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cert.id, cert.title)}
                    className="px-2 py-1 bg-red-950/30 border border-red-500/30 text-red-400 hover:bg-red-950/60 rounded text-[11px] font-mono"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {cert.image_url && (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-card-border bg-black/40">
                  <Image
                    src={cert.image_url}
                    alt={cert.title}
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
              )}

              {cert.description && (
                <p className="text-xs text-muted font-mono leading-relaxed">
                  {cert.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
