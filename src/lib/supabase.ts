import { createClient } from "@supabase/supabase-js";

function sanitizeUrl(rawUrl?: string): string {
  if (!rawUrl) return "";
  let url = rawUrl.trim().replace(/^["']|["']$/g, ""); // strip wrapping quotes

  // If user pasted the dashboard URL: https://supabase.com/dashboard/project/<project-ref>
  const dashboardMatch = url.match(/supabase\.com\/dashboard\/project\/([a-zA-Z0-9_-]+)/);
  if (dashboardMatch && dashboardMatch[1]) {
    return `https://${dashboardMatch[1]}.supabase.co`;
  }

  // Strip trailing /rest/v1 or /auth/v1 or trailing slashes
  url = url.replace(/\/+(rest|auth)?(\/v[0-9]+)?\/?$/i, "");
  url = url.replace(/\/+$/, "");

  // Ensure it has protocol
  if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  return url;
}

function sanitizeKey(rawKey?: string): string {
  if (!rawKey) return "";
  return rawKey.trim().replace(/^["']|["']$/g, "");
}

const supabaseUrl = sanitizeUrl(process.env.NEXT_PUBLIC_SUPABASE_URL);
const supabaseAnonKey = sanitizeKey(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const isConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !supabaseUrl.includes("your-project-id") &&
  !supabaseAnonKey.includes("your-anon-key");

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = (): boolean => isConfigured;

