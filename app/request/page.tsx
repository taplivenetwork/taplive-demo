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

    // Check auth first
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      // Store form data in sessionStorage, redirect to join
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pendingRequest", JSON.stringify(form));
      }
      router.push("/join?redirect=/request");
      return;
    }

    // Create order
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
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Request created", description: "Your request is now live!" });
    router.push("/app/customer/home");
  }

  return (
    <div className="dark noise-bg min-h-screen bg-background text-foreground">
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold"
          >
            <Radio className="h-5 w-5 text-primary" />
            <span className="font-display text-xl">TapLive</span>
          </Link>
          <Link href="/join">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-xl px-4 py-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <h1 className="font-display text-3xl tracking-tight">
          Create a request
        </h1>
        <p className="mt-2 text-muted-foreground">
          Describe what you need. A local provider will pick it up.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">
              Location <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="e.g., Tokyo, Shibuya crossing"
                value={form.location_text}
                onChange={(e) => update("location_text", e.target.value)}
                className="bg-card/50 pl-9"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.category}
              onValueChange={(v) => update("category", v)}
            >
              <SelectTrigger className="bg-card/50">
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
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Tell the provider exactly what you need..."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="min-h-[100px] bg-card/50"
              required
            />
          </div>

          {/* Preferred time */}
          <div className="space-y-2">
            <Label htmlFor="time">Preferred time</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                placeholder="e.g., Tomorrow morning, ASAP"
                value={form.preferred_time_text}
                onChange={(e) => update("preferred_time_text", e.target.value)}
                className="bg-card/50 pl-9"
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="budget"
                  type="number"
                  placeholder="Optional"
                  value={form.budget_usd}
                  onChange={(e) => update("budget_usd", e.target.value)}
                  className="bg-card/50 pl-9"
                  min="0"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Select
                value={form.duration_minutes}
                onValueChange={(v) => update("duration_minutes", v)}
              >
                <SelectTrigger className="bg-card/50">
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
            <Label htmlFor="lang">Language preference</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="lang"
                placeholder="e.g., English, Japanese"
                value={form.language_preference}
                onChange={(e) => update("language_preference", e.target.value)}
                className="bg-card/50 pl-9"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Submit request"
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
        <div className="dark min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      }
    >
      <RequestFormInner />
    </Suspense>
  );
}
