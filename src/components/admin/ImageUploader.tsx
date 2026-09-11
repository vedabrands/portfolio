"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface ImageUploaderProps {
  currentUrl?: string | null;
  onUploadComplete: (publicUrl: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUploader({
  currentUrl,
  onUploadComplete,
  folder = "uploads",
  label = "Upload Image",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      if (!isSupabaseConfigured() || !supabase) {
        throw new Error("Supabase is not configured.");
      }

      // Generate clean unique filename
      const ext = file.name.split(".").pop() || "png";
      const sanitizedName = file.name
        .split(".")[0]
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase();
      const fileName = `${folder}/${Date.now()}-${sanitizedName}.${ext}`;

      // Upload directly to bucket 'portfolio-media'
      const { error: uploadError } = await supabase.storage
        .from("portfolio-media")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Retrieve public URL
      const { data } = supabase.storage
        .from("portfolio-media")
        .getPublicUrl(fileName);

      const publicUrl = data.publicUrl;
      setPreview(publicUrl);
      onUploadComplete(publicUrl);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block font-mono text-xs text-muted uppercase tracking-wider">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {preview && (
          <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-card-border bg-[#111113] flex-shrink-0 group">
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                onUploadComplete("");
              }}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-mono text-red-400 transition-opacity"
            >
              Remove
            </button>
          </div>
        )}

        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2.5 bg-[#18181b] hover:bg-[#202024] border border-card-border rounded-xl font-mono text-xs text-foreground hover:border-accent/60 transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span>Uploading to Supabase Storage...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-accent"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>{preview ? "Replace Image" : "Choose File to Upload"}</span>
              </>
            )}
          </button>

          <p className="font-mono text-[10px] text-muted mt-1.5">
            Max 50MB. PNG, JPEG, WebP, SVG, GIF directly uploaded to Supabase Storage.
          </p>

          {error && (
            <p className="font-mono text-xs text-red-400 mt-1">
              Upload Error: {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
