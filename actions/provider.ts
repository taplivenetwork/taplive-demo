"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function getProviderProfile() {
  const user = await requireAuth();
  const supabase = createServerSupabase();

  const { data } = await supabase
    .from("provider_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return data;
}

export async function upsertProviderProfile(profileData: Record<string, unknown>) {
  const user = await requireAuth();
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("provider_profiles")
    .upsert(
      {
        user_id: user.id,
        ...profileData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function activateProvider() {
  const user = await requireAuth();
  const supabase = createServerSupabase();

  const { error } = await supabase
    .from("provider_profiles")
    .update({ status: "active", updated_at: new Date().toISOString() })
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  redirect("/app/provider/home");
}
