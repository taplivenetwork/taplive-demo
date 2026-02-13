"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  DollarSign,
  Globe,
  Loader2,
  RefreshCw,
  CheckCircle2,
  Tag,
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Open requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and accept requests from customers
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadOrders} className="gap-1.5">
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-lg text-muted-foreground">No open requests right now</p>
          <p className="mt-1 text-sm text-muted-foreground">Check back soon or refresh</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <Badge variant="secondary" className="text-xs">
                  <Tag className="mr-1 h-3 w-3" />
                  {categoryLabels[order.category] || order.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-3 flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm font-medium">{order.location_text}</p>
              </div>

              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {order.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
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

              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleAccept(order.id)}
                  disabled={accepting === order.id}
                  className="flex-1 gap-1"
                >
                  {accepting === order.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" /> Accept
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
