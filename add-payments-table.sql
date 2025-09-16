-- Add payments table for tracking all payment methods
CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE public.payment_method_type AS ENUM ('stripe', 'paypal', 'mobile_money_mtn', 'mobile_money_telecom', 'bank_transfer');

CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  payment_method public.payment_method_type NOT NULL,
  payment_intent_id text, -- For Stripe
  paypal_order_id text, -- For PayPal
  amount_cents bigint NOT NULL,
  currency text NOT NULL DEFAULT 'NAD',
  status public.payment_status NOT NULL DEFAULT 'pending',
  provider_details jsonb, -- For mobile money/bank details
  bank_details jsonb, -- For bank transfer details
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  failure_reason text
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment records
CREATE POLICY "Users can view own payments" ON public.payments 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o 
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

-- Admins can view all payments
CREATE POLICY "Admins can view all payments" ON public.payments 
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Admins can manage all payments
CREATE POLICY "Admins can manage all payments" ON public.payments 
  FOR ALL USING (public.is_admin(auth.uid())) 
  WITH CHECK (public.is_admin(auth.uid()));

-- API can insert payment records
CREATE POLICY "API can insert payments" ON public.payments 
  FOR INSERT WITH CHECK (true);

-- API can update payment status
CREATE POLICY "API can update payments" ON public.payments 
  FOR UPDATE WITH CHECK (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION public.update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_payments_updated_at();

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_method ON public.payments(payment_method);

