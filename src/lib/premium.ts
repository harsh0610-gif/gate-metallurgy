import type { SupabaseClient } from "@supabase/supabase-js";

export async function checkIsPremium(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_premium")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.is_premium ?? false;
}
