"use client";

import { useRealtimeOrders } from "@/hooks/use-realtime-orders";
import { useAuth } from "@/components/auth-provider";
import { formatNAD } from "@/lib/currency";

export function UserOrdersRealtime() {
  const { user } = useAuth();
  const { orders, loading, error } = useRealtimeOrders(user, false);

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

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "pending": return "Your order is being processed";
      case "paid": return "Payment received, preparing your order";
      case "shipped": return "Your order is on its way";
      case "delivered": return "Your order has been delivered";
      case "cancelled": return "Your order has been cancelled";
      default: return "Order status unknown";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading Your Orders...</h3>
        <p className="text-gray-500">Fetching your order history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Orders</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h3>
        <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
        <a 
          href="/products" 
          className="inline-block bg-[#B88972] text-white px-6 py-3 rounded-lg hover:bg-[#A67B5B] transition-colors"
        >
          Start Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow-lg p-6">
          {/* Order Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Order #{order.id.slice(0, 8)}
              </h3>
              <p className="text-sm text-gray-500">
                Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="mt-2 md:mt-0 text-right">
              <div className="text-xl font-bold text-[#B88972] mb-1">
                {formatNAD(order.total_cents)}
              </div>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Status Description */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700">
              {getStatusDescription(order.status)}
            </p>
          </div>

          {/* Order Items */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Order Items</h4>
            <div className="space-y-2">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{item.products?.title}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatNAD(item.price_cents * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
            <div className="text-sm text-gray-600">
              <p>{order.customer_name}</p>
              <p>{order.shipping_city}, {order.shipping_country}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`/orders/${order.id}`}
              className="flex-1 bg-[#B88972] text-white px-4 py-2 rounded-lg text-center hover:bg-[#A67B5B] transition-colors"
            >
              View Order Details
            </a>
            {order.status === 'delivered' && (
              <button className="flex-1 border border-[#B88972] text-[#B88972] px-4 py-2 rounded-lg hover:bg-[#B88972] hover:text-white transition-colors">
                Reorder
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
