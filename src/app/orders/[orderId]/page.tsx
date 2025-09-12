import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatNAD } from "@/lib/currency";

export default async function OrderConfirmation({ params }: { params: { orderId: string } }) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: order } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      subtotal_cents,
      shipping_cents,
      total_cents,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_postal_code,
      shipping_country,
      notes,
      created_at,
      order_items (
        id,
        quantity,
        price_cents,
        products (
          id,
          title
        )
      )
    `)
    .eq("id", params.orderId)
    .eq("user_id", user.id)
    .single();

  if (!order) {
    return (
      <div className="container-page py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-4">The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <a href="/dashboard" className="text-[#B88972] hover:underline">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "paid": return "text-blue-600 bg-blue-100";
      case "shipped": return "text-purple-600 bg-purple-100";
      case "delivered": return "text-green-600 bg-green-100";
      case "cancelled": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="container-page py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#B88972] mb-2">Order Confirmation</h1>
          <p className="text-gray-600">Thank you for your order! We'll process it shortly.</p>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Order #{order.id.slice(0, 8)}</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <p className="text-gray-600">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.products?.title}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{formatNAD(item.price_cents * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-sm mb-2">
                <span>Subtotal:</span>
                <span>{formatNAD(order.subtotal_cents)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Shipping:</span>
                <span>{formatNAD(order.shipping_cents)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-[#B88972]">{formatNAD(order.total_cents)}</span>
              </div>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {order.customer_name}</p>
                <p><strong>Email:</strong> {order.customer_email}</p>
                {order.customer_phone && (
                  <p><strong>Phone:</strong> {order.customer_phone}</p>
                )}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
              <div className="space-y-2 text-sm">
                <p>{order.shipping_address}</p>
                <p>{order.shipping_city}{order.shipping_postal_code && `, ${order.shipping_postal_code}`}</p>
                <p>{order.shipping_country}</p>
              </div>
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Order Notes</h3>
                <p className="text-sm text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 text-center">
          <a
            href="/dashboard"
            className="inline-block bg-[#B88972] text-white px-6 py-3 rounded-lg hover:bg-[#A67B5B] transition-colors mr-4"
          >
            View All Orders
          </a>
          <a
            href="/products"
            className="inline-block border border-[#B88972] text-[#B88972] px-6 py-3 rounded-lg hover:bg-[#B88972] hover:text-white transition-colors"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
}
