import { getSupabaseServerClient } from "@/lib/supabase/server";
import { formatNAD } from "@/lib/currency";
import { redirect } from "next/navigation";

export default async function CheckoutPage() {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: cartItems }] = await Promise.all([
    supabase.from("profiles").select("wallet_cents").eq("id", user.id).single(),
    supabase
      .from("cart_items")
      .select("id, quantity, product_variants(id, product_id, sizes(id,label)), products:product_variants.product_id (id, title, price_cents)")
  ]);

  const items = (cartItems ?? []).map((ci: any) => ({
    productId: ci.products?.id,
    sizeId: ci.product_variants?.sizes?.id,
    title: ci.products?.title,
    quantity: ci.quantity,
    price_cents: ci.products?.price_cents ?? 0,
    variantId: ci.product_variants?.id,
  }));

  const subtotal_cents = items.reduce((sum: number, i: any) => sum + i.price_cents * i.quantity, 0);
  const shipping_cents = 0;
  const total_cents = subtotal_cents + shipping_cents;

  async function placeOrder() {
    "use server";
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Not authenticated" };

    // Re-fetch minimal data for safety
    const { data: profile } = await supabase.from("profiles").select("wallet_cents").eq("id", user.id).single();
    const { data: cartItems } = await supabase
      .from("cart_items")
      .select("id, quantity, product_variants(id, product_id, sizes(id,label)), products:product_variants.product_id (id, price_cents)");
    const items = (cartItems ?? []).map((ci: any) => ({
      productId: ci.products?.id,
      sizeId: ci.product_variants?.sizes?.id,
      quantity: ci.quantity,
      price_cents: ci.products?.price_cents ?? 0,
      variantId: ci.product_variants?.id,
    }));
    const subtotal = items.reduce((sum: number, i: any) => sum + i.price_cents * i.quantity, 0);
    const total = subtotal; // no shipping for now

    if ((profile?.wallet_cents ?? 0) < total) {
      return { error: "Insufficient wallet balance" };
    }

    // Create order
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({ user_id: user.id, subtotal_cents: subtotal, total_cents: total, status: "paid" })
      .select("id")
      .single();
    if (orderErr) return { error: orderErr.message };

    // Insert items
    if (order) {
      const orderItems = items.map((i: any) => ({
        order_id: order.id,
        product_id: i.productId,
        size_id: i.sizeId,
        quantity: i.quantity,
        price_cents: i.price_cents,
      }));
      await supabase.from("order_items").insert(orderItems);

      // Deduct wallet and record tx
      await supabase.from("wallet_transactions").insert({ user_id: user.id, amount_cents: -total, kind: "purchase", order_id: order.id });
      await supabase.from("profiles").update({ wallet_cents: (profile?.wallet_cents ?? 0) - total }).eq("id", user.id);

      // Clear cart
      await supabase.from("cart_items").delete().neq("id", "").select();
    }

    redirect(`/orders/${order?.id}`);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <ul className="grid gap-2 mb-4">
        {items.map((i: any, idx: number) => (
          <li key={idx} className="flex justify-between text-sm">
            <span>{i.title} x {i.quantity}</span>
            <span>{formatNAD(i.price_cents * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between mb-2"><span>Subtotal</span><span>{formatNAD(subtotal_cents)}</span></div>
      <div className="flex justify-between mb-2"><span>Shipping</span><span>{formatNAD(shipping_cents)}</span></div>
      <div className="flex justify-between font-medium mb-4"><span>Total</span><span>{formatNAD(total_cents)}</span></div>
      <div className="mb-4 text-sm text-gray-700">Wallet balance: {formatNAD(profile?.wallet_cents ?? 0)}</div>
      <div className="flex gap-3">
        <form action={placeOrder}>
          <button className="border border-[#B88972] text-[#B88972] rounded px-5 py-2.5 text-sm hover:bg-[#B88972]/10" disabled={(profile?.wallet_cents ?? 0) < total_cents}>
            Pay with wallet
          </button>
        </form>
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
          <p className="text-gray-600 text-sm mb-2">🚧 Card payments are under construction</p>
          <button disabled className="bg-gray-400 text-white rounded px-5 py-2.5 text-sm cursor-not-allowed opacity-60">
            Pay with Card (Coming Soon)
          </button>
        </div>
      </div>
    </div>
  );
}

