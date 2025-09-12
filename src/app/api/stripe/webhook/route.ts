import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY as string | undefined;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string | undefined;
  if (!stripeSecret || !webhookSecret) return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-06-20" });

  const raw = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const totalCents = session.amount_total ?? 0;
    const userId = (session.metadata as any)?.user_id as string | undefined;
    // Create a paid order record
    if (userId) {
      await supabase.from("orders").insert({ user_id: userId, subtotal_cents: totalCents, total_cents: totalCents, status: "paid" });
      // Clear cart
      const { data: cart } = await supabase.from("carts").select("id").eq("user_id", userId).maybeSingle();
      if (cart?.id) await supabase.from("cart_items").delete().eq("cart_id", cart.id);
    }
  }

  return NextResponse.json({ received: true });
}

export const dynamic = "force-dynamic";










