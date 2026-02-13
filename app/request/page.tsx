"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import {
  Radio,
  MapPin,
  ArrowLeft,
  Clock,
  DollarSign,
  Globe,
  Loader2,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toast";

function RequestFormInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    location_text: searchParams.get("location") || "",
    category: searchParams.get("category") || "",
    description: "",
    preferred_time_text: "",
    budget_usd: searchParams.get("budget") || "",
    duration_minutes: searchParams.get("duration") || "",
    language_preference: searchParams.get("language") || "",
  });

  function update(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.location_text || !form.category || !form.description) {
      toast({
        title: "Missing fields",
        description: "Location, category, and description are required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pendingRequest", JSON.stringify(form));
      }
      router.push("/join?redirect=/request");
      return;
    }

    const { error } = await supabase.from("orders").insert({
      customer_id: user.id,
      location_text: form.location_text,
      category: form.category,
      description: form.description,
      preferred_time_text: form.preferred_time_text || null,
      budget_usd: form.budget_usd ? Number(form.budget_usd) : null,
      duration_minutes: form.duration_minutes
        ? Number(form.duration_minutes)
        : null,
      language_preference: form.language_preference || null,
      status: "open",
    });

    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Request created", description: "Your request is now live!" });
    router.push("/app/customer/home");
  }

  return (
    <div className="dark noise-bg min-h-screen text-foreground" style={{ backgroundColor: "#050505" }}>
      {/* Nav */}
      <nav className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(5,5,5,0.8)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00FFA3] shadow-[0_0_12px_rgba(0,255,163,0.3)]">
              <Radio className="h-3.5 w-3.5 text-[#050505]" />
            </div>
            <span className="text-lg font-bold tracking-tight">TapLive</span>
          </Link>
          <Link href="/join">
            <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
              Sign in
            </Button>
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-xl px-5 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/30 hover:text-white/60 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(0,255,163,0.15)] bg-[rgba(0,255,163,0.06)]">
            <Video className="h-5 w-5 text-[#00FFA3]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create a live request</h1>
            <p className="text-sm text-white/35">Describe what you need. A local provider will go live for you.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 glass-strong rounded-2xl p-6 space-y-5">
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-xs uppercase tracking-wider text-white/35">
              Location <span className="text-[#00FFA3]">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-white/20" />
              <Input
                id="location"
                placeholder="e.g., Tokyo, Shibuya crossing"
                value={form.location_text}
                onChange={(e) => update("location_text", e.target.value)}
                className="pl-9"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-white/35">
              Category <span className="text-[#00FFA3]">*</span>
            </Label>
            <Select value={form.category} onValueChange={(v) => update("category", v)}>
              <SelectTrigger>
                <SelectValue placeholder="What do you need?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="explore">Explore a place</SelectItem>
                <SelectItem value="verify">Verify something</SelectItem>
                <SelectItem value="assistance">Get assistance</SelectItem>
                <SelectItem value="other">Something else</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs uppercase tracking-wider text-white/35">
              Description <span className="text-[#00FFA3]">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Tell the provider exactly what you need..."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Preferred time */}
          <div className="space-y-2">
            <Label htmlFor="time" className="text-xs uppercase tracking-wider text-white/35">Preferred time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-white/20" />
              <Input
                id="time"
                placeholder="e.g., Tomorrow morning, ASAP"
                value={form.preferred_time_text}
                onChange={(e) => update("preferred_time_text", e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-xs uppercase tracking-wider text-white/35">Budget (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-white/20" />
                <Input
                  id="budget"
                  type="number"
                  placeholder="Optional"
                  value={form.budget_usd}
                  onChange={(e) => update("budget_usd", e.target.value)}
                  className="pl-9"
                  min="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-white/35">Duration</Label>
              <Select value={form.duration_minutes} onValueChange={(v) => update("duration_minutes", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="How long?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 min</SelectItem>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label htmlFor="lang" className="text-xs uppercase tracking-wider text-white/35">Language preference</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-white/20" />
              <Input
                id="lang"
                placeholder="e.g., English, Japanese"
                value={form.language_preference}
                onChange={(e) => update("language_preference", e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Video className="h-4 w-4" />
                Submit live request
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function RequestPage() {
  return (
    <Suspense
      fallback={
        <div className="dark min-h-screen flex items-center justify-center" style={{ backgroundColor: "#050505" }}>
          <Loader2 className="h-6 w-6 animate-spin text-[#00FFA3]" />
        </div>
      }
    >
      <RequestFormInner />
    </Suspense>
  );
}
