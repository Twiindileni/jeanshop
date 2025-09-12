"use client";

import { useAuth } from "@/components/auth-provider";
import { useRealtimeOrders } from "@/hooks/use-realtime-orders";
import { formatNAD } from "@/lib/currency";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
	const { user, loading: authLoading } = useAuth();
	const { orders, loading: ordersLoading } = useRealtimeOrders(user, false);
	const [profile, setProfile] = useState<any>(null);
	const [cart, setCart] = useState<any[]>([]);

	useEffect(() => {
		if (!authLoading && !user) {
			redirect("/login");
		}
	}, [user, authLoading]);

	if (authLoading || ordersLoading) {
		return (
			<div className="p-6 max-w-5xl mx-auto">
				<div className="text-center py-12">
					<div className="text-6xl mb-4">⏳</div>
					<h3 className="text-xl font-semibold text-gray-600 mb-2">Loading Dashboard...</h3>
					<p className="text-gray-500">Please wait while we load your data.</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return null; // Will redirect
	}

	return (
		<div className="p-6 max-w-5xl mx-auto grid gap-6">
			<section className="border rounded p-4">
				<h2 className="font-semibold mb-2">Welcome back!</h2>
				<p className="text-gray-600">Track your orders and manage your account.</p>
			</section>

			<section className="border rounded p-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="font-semibold text-lg">Recent Orders</h2>
					{orders && orders.length > 0 && (
						<a href="/dashboard/orders" className="text-[#B88972] hover:underline text-sm">
							View All Orders
						</a>
					)}
				</div>
				
				{!orders || orders.length === 0 ? (
					<div className="text-center py-8">
						<div className="text-4xl mb-2">📦</div>
						<p className="text-gray-500 mb-4">No orders yet</p>
						<a href="/products" className="text-[#B88972] hover:underline">
							Start Shopping
						</a>
					</div>
				) : (
					<div className="space-y-3">
						{orders.slice(0, 5).map((order: any) => {
							const getStatusColor = (status: string) => {
								switch (status) {
									case "pending": return "bg-yellow-100 text-yellow-800";
									case "paid": return "bg-blue-100 text-blue-800";
									case "shipped": return "bg-purple-100 text-purple-800";
									case "delivered": return "bg-green-100 text-green-800";
									case "cancelled": return "bg-red-100 text-red-800";
									default: return "bg-gray-100 text-gray-800";
								}
							};

							return (
								<div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
									<div className="flex justify-between items-start mb-2">
										<div>
											<div className="font-medium text-gray-900">
												Order #{order.id.slice(0, 8)}
											</div>
											<div className="text-sm text-gray-500">
												{new Date(order.created_at).toLocaleDateString()}
											</div>
										</div>
										<div className="text-right">
											<div className="font-semibold text-[#B88972]">
												{formatNAD(order.total_cents)}
											</div>
											<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
												{order.status.charAt(0).toUpperCase() + order.status.slice(1)}
											</span>
										</div>
									</div>
									
									<div className="text-sm text-gray-600 mb-2">
										{order.order_items?.length || 0} item(s): {order.order_items?.map((item: any) => `${item.products?.title} (x${item.quantity})`).join(", ")}
									</div>
									
									<div className="text-sm text-gray-500">
										Shipping to: {order.shipping_city}, {order.shipping_country}
									</div>
									
									<div className="mt-3">
										<a 
											href={`/orders/${order.id}`}
											className="text-[#B88972] hover:underline text-sm font-medium"
										>
											View Order Details →
										</a>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</section>
		</div>
	);
}