"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function createOrder(formData: FormData) {
  const user = await requireAuth();
  const supabase = createServerSupabase();

  const location_text = formData.get("location_text") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;

  if (!location_text || !category || !description) {
    return { error: "Location, category, and description are required" };
  }

  const { error } = await supabase.from("orders").insert({
    customer_id: user.id,
    location_text,
    category,
    description,
    preferred_time_text: (formData.get("preferred_time_text") as string) || null,
    budget_usd: formData.get("budget_usd")
      ? Number(formData.get("budget_usd"))
      : null,
    duration_minutes: formData.get("duration_minutes")
      ? Number(formData.get("duration_minutes"))
      : null,
    language_preference:
      (formData.get("language_preference") as string) || null,
    status: "open",
  });

  if (error) return { error: error.message };
  redirect("/app/customer/home");
}

export async function getMyOrders() {
  const user = await requireAuth();
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data || [];
}

export async function getOpenOrders(city?: string, country?: string) {
  const user = await requireAuth();
  const supabase = createServerSupabase();

  let query = supabase
    .from("orders")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(50);

  const { data, error } = await query;

  if (error) return [];
  // Filter out own orders
  return (data || []).filter((o: { customer_id: string }) => o.customer_id !== user.id);
}

export async function acceptOrder(orderId: string) {
  const user = await requireAuth();
  const supabase = createServerSupabase();

  const { error } = await supabase
    .from("orders")
    .update({
      assigned_provider_id: user.id,
      status: "accepted",
    })
    .eq("id", orderId)
    .eq("status", "open");

  if (error) return { error: error.message };
  return { success: true };
}
