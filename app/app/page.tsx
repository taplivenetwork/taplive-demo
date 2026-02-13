import { requireAuth } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import Link from "next/link";
import { User, Briefcase, ArrowRight } from "lucide-react";

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
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">
          Welcome{profile?.display_name ? `, ${profile.display_name}` : ""}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Choose how you want to use TapLive
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Customer mode */}
        <Link
          href="/app/customer/home"
          className="group rounded-xl border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
            <User className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold">Customer mode</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create requests and get help from local providers
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Go to dashboard <ArrowRight className="h-4 w-4" />
          </div>
        </Link>

        {/* Provider mode */}
        <Link
          href={providerLink}
          className="group rounded-xl border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold">Provider mode</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {providerActive
              ? "Accept requests and earn"
              : "Set up your provider profile to start earning"}
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            {providerActive ? "View requests" : "Complete setup"}{" "}
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
