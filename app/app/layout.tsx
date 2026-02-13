import { requireAuth } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import { Radio } from "lucide-react";
import { SignOutButton } from "@/components/layout/sign-out-button";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();
  const supabase = createServerSupabase();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link
            href="/app"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Radio className="h-5 w-5 text-primary" />
            <span className="font-display text-xl">TapLive</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {profile?.display_name || user.email}
            </span>
            <SignOutButton />
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
