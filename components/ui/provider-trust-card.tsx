"use client";

import { MapPin, Globe, Star, Clock, Wifi, Shield, Zap, Award } from "lucide-react";

type TrustLevel = "new" | "verified" | "pro";

interface ProviderTrustCardProps {
  name: string;
  country: string;
  city: string;
  languages: string[];
  skills: string[];
  hourlyRate?: number;
  equipment?: string;
  rating?: number;
  responseSpeed?: string;
  trustLevel?: TrustLevel;
}

const trustConfig: Record<TrustLevel, { label: string; color: string; glow: string; icon: typeof Shield }> = {
  new: {
    label: "New",
    color: "text-white/50",
    glow: "",
    icon: Shield,
  },
  verified: {
    label: "Verified",
    color: "text-[#60A5FA]",
    glow: "shadow-[0_0_8px_rgba(96,165,250,0.2)]",
    icon: Shield,
  },
  pro: {
    label: "Pro",
    color: "text-[#00FFA3]",
    glow: "shadow-[0_0_12px_rgba(0,255,163,0.25)]",
    icon: Award,
  },
};

export function ProviderTrustCard({
  name,
  country,
  city,
  languages,
  skills,
  hourlyRate,
  equipment,
  rating = 4.8,
  responseSpeed = "~2 min",
  trustLevel = "new",
}: ProviderTrustCardProps) {
  const trust = trustConfig[trustLevel];
  const TrustIcon = trust.icon;

  return (
    <div className={`rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5 transition-all hover:border-[rgba(255,255,255,0.1)] hover:translate-y-[-2px] ${trust.glow}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[rgba(0,255,163,0.1)] flex items-center justify-center text-sm font-bold text-[#00FFA3]">
            {name[0]?.toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-white/90">{name}</div>
            <div className="flex items-center gap-1 text-xs text-white/40">
              <MapPin className="h-3 w-3" />
              {city}, {country}
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${trust.color} bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]`}>
          <TrustIcon className="h-3 w-3" />
          {trust.label}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 mb-4 py-2.5 px-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
        {rating && (
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-[#FBBF24]" fill="#FBBF24" />
            <span className="text-sm font-medium text-white/80">{rating}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-white/30" />
          <span className="text-xs text-white/50">{responseSpeed}</span>
        </div>
        {hourlyRate && (
          <div className="flex items-center gap-1">
            <Zap className="h-3.5 w-3.5 text-[#00FFA3]/60" />
            <span className="text-xs text-white/50">${hourlyRate}/hr</span>
          </div>
        )}
      </div>

      {/* Languages */}
      {languages.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1 mb-1.5 text-[10px] uppercase tracking-wider text-white/30">
            <Globe className="h-3 w-3" /> Languages
          </div>
          <div className="flex flex-wrap gap-1">
            {languages.map((l) => (
              <span key={l} className="rounded bg-[rgba(255,255,255,0.05)] px-2 py-0.5 text-xs text-white/60">{l}</span>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center gap-1 mb-1.5 text-[10px] uppercase tracking-wider text-white/30">
            <Wrench className="h-3 w-3" /> Skills
          </div>
          <div className="flex flex-wrap gap-1">
            {skills.map((s) => (
              <span key={s} className="rounded bg-[rgba(0,255,163,0.06)] px-2 py-0.5 text-xs text-[#00FFA3]/70">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Equipment */}
      {equipment && (
        <div className="flex items-center gap-1.5 text-xs text-white/35">
          <Wifi className="h-3 w-3" />
          {equipment}
        </div>
      )}
    </div>
  );
}

function Wrench(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  );
}
