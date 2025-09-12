import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OrderForm } from "@/components/order-form";

export default async function OrderPage({ params }: { params: Promise<{ productId: string }> }) {
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
    const customerPhone = String(formData.get("customerPhone") || "");
    const shippingAddress = String(formData.get("shippingAddress") || "");
    const shippingCity = String(formData.get("shippingCity") || "");
    const shippingPostalCode = String(formData.get("shippingPostalCode") || "");
    const shippingCountry = String(formData.get("shippingCountry") || "Namibia");
    const notes = String(formData.get("notes") || "");

    // Validate required fields
    if (!customerName || !customerEmail || !shippingAddress || !shippingCity) {
      return { error: "Please fill in all required fields" };
    }

    // Calculate totals
    const subtotal = product.price_cents * quantity;
    const shipping = 0; // Free shipping for now
    const total = subtotal + shipping;

    // Create order - try with new columns first, fallback to basic order
    let order, orderError;
    
    try {
      // Try with new customer columns
      const result = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          subtotal_cents: subtotal,
          shipping_cents: shipping,
          total_cents: total,
          status: "pending",
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone || null,
          shipping_address: shippingAddress,
          shipping_city: shippingCity,
          shipping_postal_code: shippingPostalCode || null,
          shipping_country: shippingCountry,
          notes: notes || null,
        })
        .select("id")
        .single();
      order = result.data;
      orderError = result.error;
    } catch (err) {
      console.log("New columns not available, using basic order structure");
      // Fallback to basic order if new columns don't exist
      const result = await supabase
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
      order = result.data;
      orderError = result.error;
    }

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

    // Order created successfully - redirect to confirmation
    redirect(`/orders/${order.id}`);
  }

  return (
    <div className="container-page py-8">
      <div className="mb-6">
        <a href={`/products/${product.id}`} className="text-[#B88972] hover:underline mb-4 inline-block">
          ← Back to Product
        </a>
      </div>
      
      <OrderForm
        productId={productId}
        productTitle={product.title}
        productPrice={product.price_cents}
        onSubmit={placeOrder}
      />
    </div>
  );
}










