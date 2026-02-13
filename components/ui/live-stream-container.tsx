"use client";

import { Video, Maximize2, Volume2, Wifi } from "lucide-react";

interface LiveStreamContainerProps {
  status?: "idle" | "connecting" | "live" | "ended";
  providerName?: string;
  location?: string;
  latency?: number;
}

export function LiveStreamContainer({
  status = "idle",
  providerName,
  location,
  latency = 42,
}: LiveStreamContainerProps) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#0A0D12]">
      {/* Scan line effect */}
      {status === "connecting" && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00FFA3]/40 to-transparent animate-scanline" />
        </div>
      )}

      {/* Center placeholder */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        {status === "idle" && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]">
              <Video className="h-7 w-7 text-[rgba(255,255,255,0.2)]" />
            </div>
            <p className="text-sm text-[rgba(255,255,255,0.3)]">Waiting for live stream</p>
          </>
        )}
        {status === "connecting" && (
          <>
            <div className="relative flex h-16 w-16 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#00FFA3]/30 animate-pulse-ring" />
              <Wifi className="h-7 w-7 text-[#00FFA3] animate-live-pulse" />
            </div>
            <p className="text-sm text-[#00FFA3]/70">Connecting to provider...</p>
          </>
        )}
        {status === "live" && (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0D12] via-[#0f1318] to-[#0A0D12] dot-grid" />
        )}
        {status === "ended" && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)]">
              <Video className="h-7 w-7 text-[rgba(255,255,255,0.15)]" />
            </div>
            <p className="text-sm text-[rgba(255,255,255,0.3)]">Session ended</p>
          </>
        )}
      </div>

      {/* Top bar overlay */}
      <div className="absolute top-0 inset-x-0 flex items-center justify-between p-3 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-2">
          {status === "live" && (
            <span className="flex items-center gap-1.5 rounded-md bg-[rgba(0,255,163,0.15)] px-2 py-0.5 text-xs font-semibold text-[#00FFA3]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00FFA3] animate-live-pulse" />
              LIVE
            </span>
          )}
          {status === "connecting" && (
            <span className="flex items-center gap-1.5 rounded-md bg-[rgba(59,130,246,0.15)] px-2 py-0.5 text-xs font-semibold text-[#60A5FA]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#60A5FA] animate-live-pulse" />
              CONNECTING
            </span>
          )}
          {location && (
            <span className="text-xs text-white/50 font-mono">{location}</span>
          )}
        </div>
        {status === "live" && (
          <div className="flex items-center gap-2 text-white/50">
            <span className="text-[10px] font-mono">{latency}ms</span>
            <button className="hover:text-white transition-colors"><Volume2 className="h-4 w-4" /></button>
            <button className="hover:text-white transition-colors"><Maximize2 className="h-4 w-4" /></button>
          </div>
        )}
      </div>

      {/* Bottom bar */}
      {providerName && status === "live" && (
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-[rgba(0,255,163,0.2)] flex items-center justify-center text-[10px] font-bold text-[#00FFA3]">
              {providerName[0]?.toUpperCase()}
            </div>
            <span className="text-xs text-white/70 font-medium">{providerName}</span>
          </div>
        </div>
      )}
    </div>
  );
}
