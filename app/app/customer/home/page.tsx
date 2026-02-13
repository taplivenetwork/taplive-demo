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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const statusVariant: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  open: "success",
  accepted: "warning",
  live: "default",
  completed: "secondary",
  cancelled: "destructive",
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

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track all your requests in one place
          </p>
        </div>
        <Link href="/request">
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" /> New request
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-12 text-center">
          <p className="text-lg text-muted-foreground">No requests yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first request to get started
          </p>
          <Link href="/request">
            <Button className="mt-4 gap-1.5">
              <Plus className="h-4 w-4" /> Create request
            </Button>
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    <Tag className="mr-1 h-3 w-3" />
                    {categoryLabels[order.category] || order.category}
                  </Badge>
                  <Badge variant={statusVariant[order.status] || "secondary"} className="text-xs capitalize">
                    {order.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-3 flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm font-medium">{order.location_text}</p>
              </div>

              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
