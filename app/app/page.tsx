import { requireAuth } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import { Eye, Briefcase, ArrowRight, Video, Activity, Globe } from "lucide-react";

export default async function AppPage() {
  const user = await requireAuth();
  const supabase = createServerSupabase();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();

  const { data: providerProfile } = await supabase
    .from("provider_profiles")
    .select("status")
    .eq("user_id", user.id)
    .single();

  const providerActive = providerProfile?.status === "active";
  const providerLink = providerActive
    ? "/app/provider/home"
    : "/app/provider/onboarding";

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white/90">
          Welcome back{profile?.display_name ? `, ${profile.display_name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-white/35">
          Choose how you want to use TapLive
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { icon: Video, label: "Live sessions", value: "0" },
          { icon: Activity, label: "Active orders", value: "0" },
          { icon: Globe, label: "Available providers", value: "—" },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4">
            <stat.icon className="h-4 w-4 text-white/20 mb-2" />
            <div className="text-xl font-bold text-white/80 font-mono">{stat.value}</div>
            <div className="text-[10px] text-white/30 uppercase tracking-wider mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Role switch cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Customer mode */}
        <Link
          href="/app/customer/home"
          className="group relative rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-6 transition-all hover:border-[rgba(59,130,246,0.25)] hover:bg-[rgba(59,130,246,0.03)] hover:translate-y-[-2px]"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(59,130,246,0.2)] bg-[rgba(59,130,246,0.08)]">
            <Eye className="h-5 w-5 text-[#60A5FA]" />
          </div>
          <h2 className="text-lg font-semibold text-white/90">Customer mode</h2>
          <p className="mt-1 text-sm text-white/35">
            Request live views and get real-time assistance from local providers
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#60A5FA] opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
            Go to dashboard <ArrowRight className="h-4 w-4" />
          </div>
        </Link>

        {/* Provider mode */}
        <Link
          href={providerLink}
          className="group relative rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-6 transition-all hover:border-[rgba(0,255,163,0.25)] hover:bg-[rgba(0,255,163,0.03)] hover:translate-y-[-2px]"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[rgba(0,255,163,0.2)] bg-[rgba(0,255,163,0.08)]">
            <Briefcase className="h-5 w-5 text-[#00FFA3]" />
          </div>
          <h2 className="text-lg font-semibold text-white/90">Provider mode</h2>
          <p className="mt-1 text-sm text-white/35">
            {providerActive
              ? "Accept live requests and earn in real-time"
              : "Set up your provider profile to start earning"}
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#00FFA3] opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
            {providerActive ? "View requests" : "Complete setup"}{" "}
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
