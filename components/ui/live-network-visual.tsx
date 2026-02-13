"use client";

import { useEffect, useState } from "react";
import { Video, Wifi } from "lucide-react";

const NODES = [
  { id: 1, x: 72, y: 28, city: "Tokyo", viewers: 12, latency: 28 },
  { id: 2, x: 25, y: 38, city: "London", viewers: 8, latency: 45 },
  { id: 3, x: 82, y: 55, city: "Sydney", viewers: 5, latency: 62 },
  { id: 4, x: 15, y: 52, city: "São Paulo", viewers: 9, latency: 38 },
  { id: 5, x: 48, y: 22, city: "Berlin", viewers: 6, latency: 31 },
  { id: 6, x: 55, y: 60, city: "Nairobi", viewers: 4, latency: 55 },
  { id: 7, x: 38, y: 40, city: "NYC", viewers: 15, latency: 22 },
];

const CONNECTIONS = [
  [0, 1], [1, 4], [4, 0], [2, 5], [3, 6], [6, 1], [0, 2],
];

export function LiveNetworkVisual() {
  const [activeNode, setActiveNode] = useState(0);
  const [pulseNodes, setPulseNodes] = useState<Set<number>>(new Set([0, 3, 6]));

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((p) => (p + 1) % NODES.length);
      setPulseNodes((prev) => {
        const arr = Array.from(prev);
        const next = new Set(arr);
        next.delete(arr[0]);
        next.add(Math.floor(Math.random() * NODES.length));
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px] select-none">
      {/* Grid overlay */}
      <div className="absolute inset-0 dot-grid opacity-60" />

      {/* SVG connections */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 80" preserveAspectRatio="none">
        {CONNECTIONS.map(([a, b], i) => (
          <line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="rgba(0,255,163,0.08)"
            strokeWidth="0.15"
            strokeDasharray="1 1"
          />
        ))}
      </svg>

      {/* Nodes */}
      {NODES.map((node, i) => {
        const isActive = pulseNodes.has(i);
        const isFeatured = i === activeNode;

        return (
          <div
            key={node.id}
            className="absolute transition-all duration-700"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Pulse ring */}
            {isActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border border-[#00FFA3]/20 animate-pulse-ring" />
              </div>
            )}

            {/* Node dot */}
            <div
              className={`relative flex items-center justify-center rounded-full transition-all duration-500 ${
                isActive
                  ? "h-3 w-3 bg-[#00FFA3] shadow-[0_0_12px_rgba(0,255,163,0.5)]"
                  : "h-2 w-2 bg-[rgba(255,255,255,0.15)]"
              }`}
            />

            {/* Featured live card */}
            {isFeatured && (
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 glass rounded-lg p-2.5 w-[140px] animate-fade-in"
                style={{ animationDuration: "0.3s" }}
              >
                {/* Mini video placeholder */}
                <div className="relative aspect-video w-full rounded-md bg-[#0A0D12] border border-[rgba(255,255,255,0.06)] overflow-hidden mb-2">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="h-4 w-4 text-[rgba(255,255,255,0.12)]" />
                  </div>
                  <div className="absolute top-1 left-1 flex items-center gap-1 rounded bg-[rgba(0,255,163,0.2)] px-1 py-px">
                    <span className="h-1 w-1 rounded-full bg-[#00FFA3] animate-live-pulse" />
                    <span className="text-[8px] font-bold text-[#00FFA3]">LIVE</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium text-white/70">{node.city}</span>
                  <span className="flex items-center gap-0.5 text-[9px] font-mono text-[#00FFA3]/60">
                    <Wifi className="h-2.5 w-2.5" />
                    {node.latency}ms
                  </span>
                </div>
                <div className="mt-0.5 text-[9px] text-white/30">{node.viewers} watching</div>
              </div>
            )}

            {/* Label (non-featured active) */}
            {isActive && !isFeatured && (
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 whitespace-nowrap">
                <span className="text-[9px] font-medium text-[rgba(255,255,255,0.4)]">{node.city}</span>
              </div>
            )}
          </div>
        );
      })}

      {/* Stats overlay bottom-left */}
      <div className="absolute bottom-4 left-4 glass rounded-lg p-3 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00FFA3] animate-live-pulse" />
          <span className="text-[10px] font-semibold text-[#00FFA3] uppercase tracking-wider">Network active</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="text-sm font-bold text-white/90 font-mono">247</div>
            <div className="text-[9px] text-white/30">Providers</div>
          </div>
          <div>
            <div className="text-sm font-bold text-white/90 font-mono">18</div>
            <div className="text-[9px] text-white/30">Live now</div>
          </div>
          <div>
            <div className="text-sm font-bold text-white/90 font-mono">42</div>
            <div className="text-[9px] text-white/30">Countries</div>
          </div>
        </div>
      </div>
    </div>
  );
}
