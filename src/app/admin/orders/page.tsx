"use client";

import { AdminOrdersRealtime } from "@/components/admin-orders-realtime";
import { useAuth } from "@/components/auth-provider";
import { useRealtimeOrders } from "@/hooks/use-realtime-orders";
import { formatNAD } from "@/lib/currency";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function AdminOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const { orders } = useRealtimeOrders(user, true);

  useEffect(() => {
    if (!authLoading && !user) {
      redirect("/login");
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="container-page py-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading...</h3>
          <p className="text-gray-500">Please wait while we load the admin dashboard.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#B88972] mb-2">Orders Management</h1>
        <p className="text-gray-600">Manage and track all customer orders in real-time</p>
      </div>

      <AdminOrdersRealtime />

      {/* Summary Stats */}
      {orders && orders.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-[#B88972]">
              {orders.length}
            </div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">
              {orders.filter((o: any) => o.status === 'delivered').length}
            </div>
            <div className="text-sm text-gray-600">Delivered</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">
              {orders.filter((o: any) => o.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">
              {formatNAD(orders.reduce((sum: number, o: any) => sum + o.total_cents, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>
      )}
    </div>
  );
}

