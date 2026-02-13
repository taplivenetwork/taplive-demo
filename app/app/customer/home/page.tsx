"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus,
  MapPin,
  Clock,
  DollarSign,
  Loader2,
  Tag,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LiveStreamContainer } from "@/components/ui/live-stream-container";
import { createClient } from "@/lib/supabase/client";

type Order = {
  id: string;
  location_text: string;
  category: string;
  description: string;
  preferred_time_text: string | null;
  budget_usd: number | null;
  duration_minutes: number | null;
  status: string;
  created_at: string;
};

const statusBadge: Record<string, { variant: "live" | "matching" | "warning" | "secondary" | "destructive"; label: string }> = {
  open: { variant: "matching", label: "Open" },
  accepted: { variant: "warning", label: "Accepted" },
  live: { variant: "live", label: "LIVE" },
  completed: { variant: "secondary", label: "Completed" },
  cancelled: { variant: "destructive", label: "Cancelled" },
};

const categoryLabels: Record<string, string> = {
  explore: "Explore",
  verify: "Verify",
  assistance: "Assistance",
  other: "Other",
};

export default function CustomerHomePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    setOrders((data as Order[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const liveOrder = orders.find((o) => o.status === "live" || o.status === "accepted");

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white/90">My requests</h1>
          <p className="mt-1 text-sm text-white/35">Track all your live requests</p>
        </div>
        <Link href="/request">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> New request
          </Button>
        </Link>
      </div>

      {/* Video-first: show live stream if there's an active order */}
      {liveOrder && (
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_320px]">
          <LiveStreamContainer
            status={liveOrder.status === "live" ? "live" : "connecting"}
            location={liveOrder.location_text}
          />
          <div className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-4 space-y-3">
            <div className="text-xs uppercase tracking-wider text-white/30 mb-2">Active order</div>
            <div className="flex items-center gap-2">
              <Badge variant={statusBadge[liveOrder.status]?.variant || "secondary"}>
                {liveOrder.status === "live" && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-[#00FFA3] animate-live-pulse inline-block" />}
                {statusBadge[liveOrder.status]?.label || liveOrder.status}
              </Badge>
              <Badge variant="secondary">{categoryLabels[liveOrder.category] || liveOrder.category}</Badge>
            </div>
            <div className="flex items-start gap-2 mt-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#00FFA3]/60" />
              <p className="text-sm text-white/70">{liveOrder.location_text}</p>
            </div>
            <p className="text-sm text-white/40 line-clamp-3">{liveOrder.description}</p>
            {liveOrder.budget_usd && (
              <div className="flex items-center gap-1 text-xs text-white/30">
                <DollarSign className="h-3.5 w-3.5" />${liveOrder.budget_usd}
              </div>
            )}
            <div className="pt-2 border-t border-[rgba(255,255,255,0.06)]">
              <div className="text-[10px] uppercase tracking-wider text-white/25 mb-1">Payment status</div>
              <div className="text-xs text-[#FBBF24]">Authorized — pending session</div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#00FFA3]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
            <Video className="h-7 w-7 text-white/15" />
          </div>
          <p className="text-lg text-white/50">No requests yet</p>
          <p className="mt-1 text-sm text-white/25">Create your first live request to get started</p>
          <Link href="/request">
            <Button className="mt-4 gap-1.5">
              <Plus className="h-4 w-4" /> Create request
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const badge = statusBadge[order.status] || { variant: "secondary" as const, label: order.status };
            return (
              <div
                key={order.id}
                className="rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5 transition-all hover:border-[rgba(255,255,255,0.1)] hover:translate-y-[-1px]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Tag className="mr-1 h-3 w-3" />
                      {categoryLabels[order.category] || order.category}
                    </Badge>
                    <Badge variant={badge.variant} className="text-xs">
                      {order.status === "live" && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-[#00FFA3] animate-live-pulse inline-block" />}
                      {badge.label}
                    </Badge>
                  </div>
                  <span className="text-xs text-white/25 font-mono">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#00FFA3]/60" />
                  <p className="text-sm font-medium text-white/80">{order.location_text}</p>
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-white/35">
                  {order.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-3 text-xs text-white/25">
                  {order.duration_minutes && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {order.duration_minutes} min
                    </span>
                  )}
                  {order.budget_usd && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      ${order.budget_usd}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
