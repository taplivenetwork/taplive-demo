"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Globe,
  ArrowRight,
  Radio,
  Users,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { value: "explore", label: "Explore a place" },
  { value: "verify", label: "Verify something" },
  { value: "assistance", label: "Get assistance" },
  { value: "other", label: "Something else" },
];

const durations = [
  { value: "15", label: "15 min" },
  { value: "30", label: "30 min" },
  { value: "60", label: "1 hour" },
  { value: "120", label: "2 hours" },
];

export default function HomePage() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");
  const [language, setLanguage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (category) params.set("category", category);
    if (duration) params.set("duration", duration);
    if (budget) params.set("budget", budget);
    if (language) params.set("language", language);
    router.push(`/request?${params.toString()}`);
  }

  return (
    <div className="dark noise-bg min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold tracking-tight"
          >
            <Radio className="h-5 w-5 text-primary" />
            <span className="font-display text-xl">TapLive</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/join">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
            <Link href="/join">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex min-h-[100vh] flex-col items-center justify-center px-4 pt-14">
        {/* Gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[120px]" />
          <div className="absolute -bottom-20 right-1/4 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="mb-4 animate-fade-in text-sm font-medium uppercase tracking-[0.2em] text-primary/80">
            Live requests · Real people · Any location
          </p>
          <h1
            className="animate-fade-in font-display text-5xl leading-[1.1] tracking-tight sm:text-6xl md:text-7xl"
            style={{ animationDelay: "0.1s" }}
          >
            Eyes & hands
            <br />
            <span className="text-primary">where you need them</span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-xl animate-fade-in text-lg text-muted-foreground"
            style={{ animationDelay: "0.2s" }}
          >
            Connect with local providers in real-time. Explore a neighborhood,
            verify a listing, get on-ground assistance — all live.
          </p>
        </div>

        {/* Request Widget */}
        <div
          className="relative z-10 mx-auto mt-12 w-full max-w-2xl animate-slide-up"
          style={{ animationDelay: "0.35s", opacity: 0 }}
        >
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-2xl shadow-primary/5 backdrop-blur-sm"
          >
            <div className="mb-5 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Zap className="h-4 w-4 text-primary" />
              Start a request
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {/* Location */}
              <div className="relative sm:col-span-2">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Where do you need someone?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-11 bg-background/50 pl-9 text-sm"
                  required
                />
              </div>

              {/* Category */}
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-11 bg-background/50">
                  <SelectValue placeholder="What do you need?" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Duration */}
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="h-11 bg-background/50">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Budget */}
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="Budget (optional)"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="h-11 bg-background/50 pl-9"
                  min="0"
                />
              </div>

              {/* Language */}
              <div className="relative">
                <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Language (optional)"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="h-11 bg-background/50 pl-9"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="mt-5 w-full gap-2">
              Continue
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-6 w-4 rounded-full border-2 border-muted-foreground/30">
            <div className="mx-auto mt-1 h-1.5 w-1 rounded-full bg-muted-foreground/40" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border/40 py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-display text-3xl tracking-tight sm:text-4xl">
            How it works
          </h2>
          <div className="mt-16 grid gap-12 sm:grid-cols-3">
            {[
              {
                icon: MapPin,
                title: "Describe your need",
                desc: "Tell us the location and what you need — explore a street, verify a property, get local help.",
              },
              {
                icon: Users,
                title: "Match with a provider",
                desc: "A verified local provider near your location picks up the request and goes live.",
              },
              {
                icon: Radio,
                title: "Live connection",
                desc: "Get real-time video, photos, and interaction from someone on the ground.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-border/60 bg-card/40 transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a provider CTA */}
      <section className="border-t border-border/40 py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Shield className="h-3.5 w-3.5" />
            Earn on your own schedule
          </div>
          <h2 className="mt-6 font-display text-3xl tracking-tight sm:text-4xl">
            Become a TapLive provider
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Already have a smartphone and internet? You&apos;re almost ready. 
            Set your rates, availability, and start accepting requests in your area.
          </p>
          <Link href="/join">
            <Button size="xl" className="mt-8 gap-2">
              Join as provider
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            <span className="font-display text-base text-foreground">
              TapLive
            </span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
          <p>© {new Date().getFullYear()} TapLive</p>
        </div>
      </footer>
    </div>
  );
}
