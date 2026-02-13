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
  Video,
  Eye,
  Satellite,
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
import { LiveNetworkVisual } from "@/components/ui/live-network-visual";

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
    <div className="dark noise-bg min-h-screen text-foreground" style={{ backgroundColor: "#050505" }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(5,5,5,0.8)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00FFA3] shadow-[0_0_12px_rgba(0,255,163,0.3)]">
              <Radio className="h-3.5 w-3.5 text-[#050505]" />
            </div>
            <span className="text-lg font-bold tracking-tight">TapLive</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/join">
              <Button variant="ghost" size="sm" className="text-white/50 hover:text-white">
                Sign in
              </Button>
            </Link>
            <Link href="/join">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — split layout */}
      <section className="relative min-h-screen pt-14">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-[10%] h-[600px] w-[600px] rounded-full bg-[rgba(0,255,163,0.03)] blur-[150px]" />
          <div className="absolute bottom-0 right-[20%] h-[400px] w-[400px] rounded-full bg-[rgba(0,255,163,0.02)] blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col lg:flex-row items-center min-h-[calc(100vh-56px)] px-5 gap-8 lg:gap-12">
          {/* Left side — message + widget */}
          <div className="flex-1 flex flex-col justify-center py-16 lg:py-0">
            <div className="animate-fade-in">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(0,255,163,0.15)] bg-[rgba(0,255,163,0.06)] px-3.5 py-1 text-xs font-medium text-[#00FFA3]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00FFA3] animate-live-pulse" />
                Live platform — 18 streams active now
              </div>
            </div>

            <h1
              className="animate-fade-in text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]"
              style={{ animationDelay: "0.08s" }}
            >
              See any place in the world
              <br />
              <span className="text-accent-glow">— live.</span>
            </h1>

            <p
              className="mt-5 max-w-lg animate-fade-in text-base text-white/45 leading-relaxed"
              style={{ animationDelay: "0.16s" }}
            >
              A real-time video-based LBS order platform that connects you
              to live human presence anywhere.
            </p>

            {/* How it works inline */}
            <div
              className="mt-6 flex items-center gap-3 animate-fade-in text-sm text-white/30"
              style={{ animationDelay: "0.24s" }}
            >
              <span className="flex items-center gap-1.5 text-white/50">
                <Eye className="h-3.5 w-3.5 text-[#00FFA3]/60" />
                Place a live request
              </span>
              <span className="text-white/15">→</span>
              <span className="flex items-center gap-1.5 text-white/50">
                <Satellite className="h-3.5 w-3.5 text-[#00FFA3]/60" />
                Get matched nearby
              </span>
              <span className="text-white/15">→</span>
              <span className="flex items-center gap-1.5 text-white/50">
                <Video className="h-3.5 w-3.5 text-[#00FFA3]/60" />
                Watch instantly
              </span>
            </div>

            {/* CTAs */}
            <div
              className="mt-8 flex items-center gap-3 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Link href="/request">
                <Button size="xl" className="gap-2">
                  <Video className="h-4 w-4" />
                  Request a Live View
                </Button>
              </Link>
              <Link href="/join">
                <Button size="xl" variant="outline" className="gap-2">
                  Become a Provider
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Request widget card */}
            <div
              className="mt-10 w-full max-w-lg animate-slide-up"
              style={{ animationDelay: "0.45s", opacity: 0 }}
            >
              <form
                onSubmit={handleSubmit}
                className="glass-strong rounded-2xl p-5 glow-primary-sm"
              >
                <div className="mb-4 flex items-center gap-2 text-xs font-medium text-white/40 uppercase tracking-wider">
                  <Zap className="h-3.5 w-3.5 text-[#00FFA3]" />
                  Quick request
                </div>

                <div className="grid gap-2.5 sm:grid-cols-2">
                  <div className="relative sm:col-span-2">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-white/20" />
                    <Input
                      placeholder="Where do you need someone?"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-11 pl-9"
                      required
                    />
                  </div>

                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-11">
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

                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger className="h-11">
                      <Clock className="mr-2 h-4 w-4 text-white/20" />
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

                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-white/20" />
                    <Input
                      type="number"
                      placeholder="Budget (optional)"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="h-11 pl-9"
                      min="0"
                    />
                  </div>

                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-white/20" />
                    <Input
                      placeholder="Language (optional)"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="h-11 pl-9"
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="mt-4 w-full gap-2">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Right side — live network visual */}
          <div className="hidden lg:block flex-1 relative">
            <div className="absolute inset-0 rounded-2xl border border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.01)] overflow-hidden">
              <LiveNetworkVisual />
            </div>
            <div className="aspect-[4/3]" /> {/* aspect ratio holder */}
          </div>
        </div>
      </section>

      {/* How it works — detailed */}
      <section className="relative border-t border-[rgba(255,255,255,0.06)] py-24">
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center mb-16">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#00FFA3]/60 mb-3">The process</p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How it works
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: Eye,
                step: "01",
                title: "Place a live request",
                desc: "Describe the location and what you need — explore a street, verify a property, get local assistance.",
              },
              {
                icon: Satellite,
                step: "02",
                title: "Get matched nearby",
                desc: "Our system finds a verified provider near your target location and connects you in real-time.",
              },
              {
                icon: Video,
                step: "03",
                title: "Watch live",
                desc: "See everything through a live video feed. Direct the provider, ask questions, and get real answers.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group relative rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-6 transition-all hover:border-[rgba(0,255,163,0.15)] hover:translate-y-[-2px]"
              >
                <div className="absolute top-5 right-5 text-[40px] font-extrabold leading-none text-white/[0.03] select-none">
                  {item.step}
                </div>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(0,255,163,0.15)] bg-[rgba(0,255,163,0.06)] transition-colors group-hover:bg-[rgba(0,255,163,0.1)]">
                  <item.icon className="h-5 w-5 text-[#00FFA3]" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-white/40">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provider CTA */}
      <section className="border-t border-[rgba(255,255,255,0.06)] py-24">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(0,255,163,0.2)] bg-[rgba(0,255,163,0.06)] px-4 py-1.5 text-xs font-medium text-[#00FFA3]">
            <Shield className="h-3.5 w-3.5" />
            Earn on your own schedule
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Become a TapLive provider
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/40">
            Already have a smartphone and internet? You&apos;re almost ready.
            Set your rates, availability, and start accepting live requests in your area.
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
      <footer className="border-t border-[rgba(255,255,255,0.06)] py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-sm text-white/30 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#00FFA3]">
              <Radio className="h-3 w-3 text-[#050505]" />
            </div>
            <span className="font-semibold text-white/70">TapLive</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white/60 transition-colors">
              Terms
            </Link>
          </div>
          <p>© {new Date().getFullYear()} TapLive</p>
        </div>
      </footer>
    </div>
  );
}
