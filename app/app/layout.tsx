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
    <div className="dark min-h-screen noise-bg" style={{ backgroundColor: "#050505" }}>
      <nav className="sticky top-0 z-40 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(5,5,5,0.85)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
          <Link href="/app" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00FFA3] shadow-[0_0_10px_rgba(0,255,163,0.25)]">
              <Radio className="h-3.5 w-3.5 text-[#050505]" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white/90">TapLive</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5">
              <div className="h-5 w-5 rounded-full bg-[rgba(0,255,163,0.15)] flex items-center justify-center text-[9px] font-bold text-[#00FFA3]">
                {(profile?.display_name || user.email)?.[0]?.toUpperCase()}
              </div>
              <span className="text-sm text-white/50">
                {profile?.display_name || user.email}
              </span>
            </div>
            <SignOutButton />
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-5 py-6">{children}</main>
    </div>
  );
}
