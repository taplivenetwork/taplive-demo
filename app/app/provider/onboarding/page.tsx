"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Globe,
  Wrench,
  Smartphone,
  DollarSign,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  X,
  Plus,
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
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toast";

const STEPS = [
  { id: "basic", label: "Basic info", icon: User },
  { id: "languages", label: "Languages", icon: Globe },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "equipment", label: "Equipment", icon: Smartphone },
  { id: "pricing", label: "Pricing", icon: DollarSign },
];

type LangEntry = { language: string; level: "basic" | "fluent" | "native" };

export default function ProviderOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [timezone, setTimezone] = useState("");
  const [bio, setBio] = useState("");

  const [languages, setLanguages] = useState<LangEntry[]>([
    { language: "", level: "fluent" },
  ]);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [canDo, setCanDo] = useState("");

  const [deviceModel, setDeviceModel] = useState("");
  const [cameraQuality, setCameraQuality] = useState("1080p");
  const [networkType, setNetworkType] = useState("wifi");

  const [rateHourly, setRateHourly] = useState("");
  const [minSession, setMinSession] = useState("30");
  const [availabilityNotes, setAvailabilityNotes] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("provider_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (data) {
        setDisplayName(data.display_name || "");
        setCountry(data.country || "");
        setCity(data.city || "");
        setTimezone(data.timezone || "");
        setBio(data.bio || "");
        if (Array.isArray(data.languages) && data.languages.length > 0)
          setLanguages(data.languages as LangEntry[]);
        if (Array.isArray(data.skills)) setSkills(data.skills as string[]);
        setCanDo(data.can_do || "");
        setDeviceModel(data.device_model || "");
        setCameraQuality(data.camera_quality || "1080p");
        setNetworkType(data.network_type || "wifi");
        setRateHourly(data.rate_hourly_usd?.toString() || "");
        setMinSession(data.min_session_minutes?.toString() || "30");
        if (data.availability && typeof data.availability === "object") {
          setAvailabilityNotes(
            (data.availability as Record<string, string>).notes || ""
          );
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  async function saveStep(): Promise<boolean> {
    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return false; }

    let payload: Record<string, unknown> = {};
    switch (step) {
      case 0:
        if (!displayName || !country || !city) {
          toast({ title: "Missing fields", description: "Name, country, and city are required.", variant: "destructive" });
          setSaving(false);
          return false;
        }
        payload = { display_name: displayName, country, city, timezone, bio };
        break;
      case 1:
        payload = { languages: languages.filter((l) => l.language.trim()) };
        break;
      case 2:
        payload = { skills, can_do: canDo };
        break;
      case 3:
        payload = { device_model: deviceModel, camera_quality: cameraQuality, network_type: networkType };
        break;
      case 4:
        payload = {
          rate_hourly_usd: rateHourly ? Number(rateHourly) : null,
          min_session_minutes: Number(minSession),
          availability: { notes: availabilityNotes },
        };
        break;
    }

    const { error } = await supabase.from("provider_profiles").upsert(
      { user_id: user.id, ...payload, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );

    setSaving(false);
    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
      return false;
    }
    return true;
  }

  async function handleNext() {
    const ok = await saveStep();
    if (ok && step < STEPS.length - 1) setStep(step + 1);
  }

  async function handleFinish() {
    const ok = await saveStep();
    if (!ok) return;

    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) { setSaving(false); return; }

    const { error } = await supabase
      .from("provider_profiles")
      .update({ status: "active", updated_at: new Date().toISOString() })
      .eq("user_id", user.id);

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Profile activated!", description: "You can now accept requests." });
    router.push("/app/provider/home");
  }

  function addSkill() {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setSkillInput("");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="text-2xl font-semibold">Provider setup</h1>
      <p className="mt-1 text-muted-foreground">
        Complete your profile to start accepting requests
      </p>

      {/* Progress */}
      <div className="mt-8 flex items-center gap-1">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex flex-1 items-center gap-1">
            <button
              onClick={() => i <= step && setStep(i)}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                i < step
                  ? "bg-primary text-primary-foreground"
                  : i === step
                  ? "border-2 border-primary text-primary"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 rounded ${
                  i < step ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex">
        {STEPS.map((s, i) => (
          <div
            key={s.id}
            className={`flex-1 text-center text-xs ${
              i === step ? "text-foreground font-medium" : "text-muted-foreground"
            }`}
          >
            <span className="hidden sm:inline">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Form sections */}
      <div className="mt-8 rounded-xl border bg-card p-6">
        {/* Step 0: Basic */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Basic information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Display name *</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your public name" />
              </div>
              <div className="space-y-2">
                <Label>Country *</Label>
                <Input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="e.g., Japan" />
              </div>
              <div className="space-y-2">
                <Label>City *</Label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Tokyo" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Timezone</Label>
                <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} placeholder="e.g., Asia/Tokyo, UTC+9" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Bio (optional)</Label>
                <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell customers about yourself..." rows={3} />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Languages */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Languages you speak</h2>
            <div className="space-y-3">
              {languages.map((lang, i) => (
                <div key={i} className="flex items-end gap-2">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Language</Label>
                    <Input
                      value={lang.language}
                      onChange={(e) => {
                        const copy = [...languages];
                        copy[i] = { ...copy[i], language: e.target.value };
                        setLanguages(copy);
                      }}
                      placeholder="e.g., English"
                    />
                  </div>
                  <div className="w-32 space-y-1">
                    <Label className="text-xs">Level</Label>
                    <Select
                      value={lang.level}
                      onValueChange={(v) => {
                        const copy = [...languages];
                        copy[i] = { ...copy[i], level: v as LangEntry["level"] };
                        setLanguages(copy);
                      }}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic</SelectItem>
                        <SelectItem value="fluent">Fluent</SelectItem>
                        <SelectItem value="native">Native</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {languages.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setLanguages(languages.filter((_, idx) => idx !== i))}
                      className="shrink-0 text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => setLanguages([...languages, { language: "", level: "fluent" }])} className="gap-1">
              <Plus className="h-3.5 w-3.5" /> Add language
            </Button>
          </div>
        )}

        {/* Step 2: Skills */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Skills & capabilities</h2>
            <div className="space-y-2">
              <Label>Add skill tags</Label>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="e.g., photography, driving"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                />
                <Button variant="outline" onClick={addSkill}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1 pr-1">
                    {s}
                    <button onClick={() => setSkills(skills.filter((x) => x !== s))} className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>What can you do? (describe freely)</Label>
              <Textarea
                value={canDo}
                onChange={(e) => setCanDo(e.target.value)}
                placeholder="Describe what kinds of tasks you can help with..."
                rows={4}
              />
            </div>
          </div>
        )}

        {/* Step 3: Equipment */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Your equipment</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label>Device model</Label>
                <Input value={deviceModel} onChange={(e) => setDeviceModel(e.target.value)} placeholder="e.g., iPhone 15 Pro" />
              </div>
              <div className="space-y-2">
                <Label>Camera quality</Label>
                <Select value={cameraQuality} onValueChange={setCameraQuality}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="720p">720p</SelectItem>
                    <SelectItem value="1080p">1080p</SelectItem>
                    <SelectItem value="4k">4K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Network type</Label>
                <Select value={networkType} onValueChange={setNetworkType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5g">5G</SelectItem>
                    <SelectItem value="wifi">WiFi</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Pricing */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Pricing & availability</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Hourly rate (USD)</Label>
                <Input type="number" value={rateHourly} onChange={(e) => setRateHourly(e.target.value)} placeholder="e.g., 25" min="0" />
              </div>
              <div className="space-y-2">
                <Label>Minimum session (minutes)</Label>
                <Select value={minSession} onValueChange={setMinSession}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Availability notes</Label>
                <Textarea
                  value={availabilityNotes}
                  onChange={(e) => setAvailabilityNotes(e.target.value)}
                  placeholder="e.g., Available weekdays 9am-6pm JST, weekends flexible"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => step > 0 && setStep(step - 1)}
          disabled={step === 0}
          className="gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button onClick={handleNext} disabled={saving} className="gap-1">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Next <ArrowRight className="h-4 w-4" /></>}
          </Button>
        ) : (
          <Button onClick={handleFinish} disabled={saving} className="gap-1">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Activate profile <Check className="h-4 w-4" /></>}
          </Button>
        )}
      </div>
    </div>
  );
}
