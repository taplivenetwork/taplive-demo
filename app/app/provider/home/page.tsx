"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Clock,
  DollarSign,
  Globe,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Tag,
  Radar,
  Activity,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toast";

type Order = {
  id: string;
  location_text: string;
  category: string;
  description: string;
  preferred_time_text: string | null;
  budget_usd: number | null;
  duration_minutes: number | null;
  language_preference: string | null;
  status: string;
  created_at: string;
  customer_id: string;
};

const categoryLabels: Record<string, string> = {
  explore: "Explore",
  verify: "Verify",
  assistance: "Assistance",
  other: "Other",
};

export default function ProviderHomePage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState<string | null>(null);

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
      .eq("status", "open")
      .neq("customer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    setOrders((data as Order[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function handleAccept(orderId: string) {
    setAccepting(orderId);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("orders")
      .update({ assigned_provider_id: user.id, status: "accepted" })
      .eq("id", orderId)
      .eq("status", "open");

    setAccepting(null);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Accepted!", description: "You've accepted this request." });
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  }

  return (
    <div className="py-6">
      {/* Header with scanning indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(0,255,163,0.15)] bg-[rgba(0,255,163,0.06)]">
            <Radar className="h-5 w-5 text-[#00FFA3]" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#00FFA3] animate-live-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white/90">Open requests</h1>
            <p className="text-sm text-white/35">Scanning for nearby requests</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={loadOrders} className="gap-1.5">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {/* Status bar */}
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-[#00FFA3]" />
          <span className="text-xs text-white/40">{orders.length} open requests</span>
        </div>
        <div className="h-3 w-px bg-[rgba(255,255,255,0.06)]" />
        <div className="flex items-center gap-2">
          <Wifi className="h-3.5 w-3.5 text-[#00FFA3]/60" />
          <span className="text-xs text-white/40">Online</span>
        </div>
        <div className="flex-1" />
        <div className="relative h-1 w-16 overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
          <div className="absolute inset-y-0 w-8 rounded-full bg-gradient-to-r from-transparent via-[#00FFA3]/40 to-transparent animate-scan" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#00FFA3]" />
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
            <Radar className="h-7 w-7 text-white/15" />
          </div>
          <p className="text-lg text-white/50">No open requests right now</p>
          <p className="mt-1 text-sm text-white/25">New requests will appear here. Stay online.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {orders.map((order) => (
            <div
              key={order.id}
              className="group rounded-xl border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] p-5 transition-all duration-200 hover:border-[rgba(0,255,163,0.15)] hover:bg-[rgba(0,255,163,0.02)] hover:translate-y-[-2px] hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="matching" className="text-xs">
                    <Tag className="mr-1 h-3 w-3" />
                    {categoryLabels[order.category] || order.category}
                  </Badge>
                  <Badge variant="live" className="text-xs">
                    <span className="mr-1 h-1.5 w-1.5 rounded-full bg-[#00FFA3] animate-live-pulse inline-block" />
                    OPEN
                  </Badge>
                </div>
                <span className="text-[10px] text-white/20 font-mono">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-3 flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#00FFA3]/60" />
                <p className="text-sm font-medium text-white/80">{order.location_text}</p>
              </div>

              <p className="mt-2 line-clamp-3 text-sm text-white/35">
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
                {order.language_preference && (
                  <span className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" />
                    {order.language_preference}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <Button
                  size="sm"
                  onClick={() => handleAccept(order.id)}
                  disabled={accepting === order.id}
                  className="w-full gap-1.5"
                >
                  {accepting === order.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Accept Request
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
