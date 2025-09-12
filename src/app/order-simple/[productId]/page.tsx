import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SimpleOrderPage({ params }: { params: Promise<{ productId: string }> }) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { productId } = await params;
  const { data: product } = await supabase
    .from("products")
    .select("id, title, price_cents")
    .eq("id", productId)
    .single();

  if (!product) {
    return (
      <div className="container-page py-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <a href="/products" className="text-[#B88972] hover:underline">
            ← Back to Products
          </a>
        </div>
      </div>
    );
  }

  async function placeOrder(formData: FormData) {
    "use server";
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not logged in" };

    // Extract form data
    const quantity = Math.max(1, Number(formData.get("quantity") || 1));
    const customerName = String(formData.get("customerName") || "");
    const customerEmail = String(formData.get("customerEmail") || "");

    // Validate required fields
    if (!customerName || !customerEmail) {
      return { error: "Please fill in your name and email" };
    }

    // Calculate totals
    const subtotal = product.price_cents * quantity;
    const shipping = 0; // Free shipping for now
    const total = subtotal + shipping;

    try {
      // Create basic order (without new columns for now)
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          subtotal_cents: subtotal,
          shipping_cents: shipping,
          total_cents: total,
          status: "pending",
        })
        .select("id")
        .single();

      if (orderError) {
        console.error("Order creation error:", orderError);
        return { error: orderError.message };
      }

      // Create order item
      const { data: orderItem, error: itemError } = await supabase
        .from("order_items")
        .insert({
          order_id: order.id,
          product_id: product.id,
          quantity: quantity,
          price_cents: product.price_cents,
        })
        .select("id");

      if (itemError) {
        console.error("Order item creation error:", itemError);
        console.error("Order item error details:", {
          order_id: order.id,
          product_id: product.id,
          quantity: quantity,
          price_cents: product.price_cents
        });
        // Don't return error immediately, let's see if we can continue
        console.warn("Order created but order item failed - continuing anyway");
      } else {
        console.log("Order item created successfully:", orderItem);
      }

      // Redirect to order confirmation
      redirect(`/orders/${order.id}`);
    } catch (error) {
      console.error("Unexpected error:", error);
      return { error: "An unexpected error occurred. Please try again." };
    }
  }

  return (
    <div className="container-page py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <a href={`/products/${product.id}`} className="text-[#B88972] hover:underline mb-4 inline-block">
            ← Back to Product
          </a>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#B88972] mb-2">Place Your Order</h2>
            <p className="text-gray-600">Complete your order for <strong>{product.title}</strong></p>
          </div>

          <form action={placeOrder} className="space-y-6">
            <input type="hidden" name="productId" value={productId} />
            
            {/* Product Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{product.title}</span>
                <span className="font-semibold">N${(product.price_cents / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <label className="text-gray-600">
                  Quantity:
                  <input
                    type="number"
                    min="1"
                    max="10"
                    name="quantity"
                    defaultValue={1}
                    className="ml-2 w-20 px-2 py-1 border rounded text-center"
                  />
                </label>
                <span className="font-bold text-lg text-[#B88972]">
                  Total: N${(product.price_cents / 100).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Basic Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Customer Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#B88972] to-[#A67B5B] text-white rounded-lg px-6 py-4 text-center font-semibold text-lg hover:from-[#A67B5B] hover:to-[#B88972] transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>🛍️</span>
                <span>Place Order - N${(product.price_cents / 100).toFixed(2)}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
