"use client";

import { useState, useEffect } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

interface Order {
  id: string;
  status: string;
  total_cents: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_city: string;
  shipping_country: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: Array<{
    id: string;
    quantity: number;
    products?: {
      title: string;
    };
  }>;
}

export function useRealtimeOrders(user: User | null, isAdmin: boolean = false) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();

    // Fetch initial orders
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from("orders")
          .select(`
            id,
            status,
            total_cents,
            customer_name,
            customer_email,
            customer_phone,
            shipping_city,
            shipping_country,
            notes,
            created_at,
            updated_at,
            order_items (
              id,
              quantity,
              products (
                title
              )
            )
          `)
          .order("created_at", { ascending: false });

        // If not admin, only get user's orders
        if (!isAdmin) {
          query = query.eq("user_id", user.id);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          console.error("Error fetching orders:", fetchError);
          setError(fetchError.message);
        } else {
          setOrders(data || []);
        }
      } catch (err) {
        console.error("Unexpected error fetching orders:", err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Set up real-time subscription
    const channel = supabase
      .channel("orders_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: isAdmin ? undefined : `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Order change received:", payload);
          
          if (payload.eventType === "INSERT") {
            // New order added
            setOrders(prev => [payload.new as Order, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            // Order updated (status change)
            setOrders(prev => 
              prev.map(order => 
                order.id === payload.new.id 
                  ? { ...order, ...payload.new } as Order
                  : order
              )
            );
          } else if (payload.eventType === "DELETE") {
            // Order deleted
            setOrders(prev => 
              prev.filter(order => order.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, isAdmin]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const supabase = getSupabaseBrowserClient();
    
    try {
      const { error } = await supabase
        .from("orders")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", orderId);

      if (error) {
        console.error("Error updating order status:", error);
        throw error;
      }

      return { success: true };
    } catch (err) {
      console.error("Failed to update order status:", err);
      return { success: false, error: err };
    }
  };

  return {
    orders,
    loading,
    error,
    updateOrderStatus,
    refetch: () => {
      if (user) {
        // Trigger a refetch by updating the dependency
        setLoading(true);
      }
    }
  };
}
