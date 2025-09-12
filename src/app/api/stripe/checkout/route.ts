import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY as string | undefined;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  if (!stripeSecret) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });

  const supabase = getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const mode = body?.mode === "payment" ? "payment" : "payment";
  const productId = body?.productId as string | undefined;
  const quantity = Math.max(1, Number(body?.quantity || 1));

  let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  if (productId) {
    // Buy-now for single product
    const { data: product } = await supabase
      .from("products").select("title, price_cents").eq("id", productId).single();
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    lineItems.push({
      quantity,
      price_data: {
        currency: "nad",
        unit_amount: product.price_cents,
        product_data: { name: product.title },
      },
    });
  } else {
    // From cart
    const { data: cart } = await supabase
      .from("cart_items")
      .select("quantity, product_variants(product_id), products:product_variants.product_id (title, price_cents)")
      .eq("cart_id", (await supabase.from("carts").select("id").eq("user_id", user.id).maybeSingle()).data?.id)
      ;
    (cart ?? []).forEach((ci: any) => {
      if (!ci.products) return;
      lineItems.push({
        quantity: ci.quantity,
        price_data: {
          currency: "nad",
          unit_amount: ci.products.price_cents,
          product_data: { name: ci.products.title },
        },
      });
    });
  }

  if (lineItems.length === 0) return NextResponse.json({ error: "No items" }, { status: 400 });

  const session = await stripe.checkout.sessions.create({
    mode,
    line_items: lineItems,
    customer_email: user.email ?? undefined,
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
    metadata: { user_id: user.id },
  });

  return NextResponse.json({ url: session.url });
}










