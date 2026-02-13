"use client";

import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  accentColor?: string;
}

export function StatCard({
  label,
  value,
  suffix = "",
  icon: Icon,
  trend = "neutral",
  accentColor = "rgba(0,255,163,0.15)",
}: StatCardProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 600;
    const steps = 20;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="group relative rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-4 transition-all hover:border-[rgba(255,255,255,0.1)] hover:translate-y-[-1px]">
      {/* Gradient glow border on hover */}
      <div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${accentColor}, transparent 60%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
          borderRadius: "0.75rem",
        }}
      />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-white/35 uppercase tracking-wider">{label}</span>
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.04)]">
          <Icon className="h-3.5 w-3.5 text-white/30" />
        </div>
      </div>

      <div className="flex items-end gap-1.5">
        <span className="text-2xl font-bold text-white/90 font-mono tabular-nums animate-counter">
          {display}
        </span>
        {suffix && <span className="text-sm text-white/40 mb-0.5">{suffix}</span>}
      </div>

      {trend !== "neutral" && (
        <div className={`mt-1 text-[10px] font-medium ${trend === "up" ? "text-[#00FFA3]" : "text-[#F87171]"}`}>
          {trend === "up" ? "↑" : "↓"} vs last week
        </div>
      )}
    </div>
  );
}
