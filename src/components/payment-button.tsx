"use client";

interface PaymentButtonProps {
  amount: number; // in cents
  currency?: string;
  productName: string;
  orderId: string;
  customerEmail: string;
  onPaymentSuccess?: (details: any) => void;
  onPaymentError?: (error: string) => void;
}

export function PaymentButton({ 
  amount, 
  currency = "NAD", 
  productName, 
  orderId, 
  customerEmail,
  onPaymentSuccess,
  onPaymentError 
}: PaymentButtonProps) {
  const handleClick = () => {
    // Redirect directly to Stripe checkout
    window.open('https://buy.stripe.com/test_3cIeVe0lB27r55JdZqbfO00', '_blank');
  };

  return (
    <button 
      onClick={handleClick}
      className="w-full bg-gradient-to-r from-[#B88972] to-[#A67B5B] text-white rounded-lg px-6 py-3 text-center font-medium hover:from-[#A67B5B] hover:to-[#B88972] transition-all duration-300 flex items-center justify-center gap-2"
    >
      <span>💳</span>
      <span>Pay Now</span>
    </button>
  );
}
