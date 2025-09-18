"use client";

import { useState } from "react";
import PaymentMethods from "./payment/payment-methods";

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
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handlePaymentSuccess = (paymentDetails: any) => {
    console.log('Payment successful:', paymentDetails);
    setShowModal(false);
    if (onPaymentSuccess) {
      onPaymentSuccess(paymentDetails);
    }
    // Redirect to success page or show success message
    window.location.href = `/orders/${orderId}?payment=success`;
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    if (onPaymentError) {
      onPaymentError(error);
    }
    // Show error message but keep modal open
    alert(`Payment failed: ${error}`);
  };

  return (
    <>
             <button 
               onClick={handleClick}
               className="w-full bg-gradient-to-r from-[#B88972] to-[#A67B5B] text-white rounded-lg px-6 py-3 text-center font-medium hover:from-[#A67B5B] hover:to-[#B88972] transition-all duration-300 flex items-center justify-center gap-2"
             >
               <span>💳</span>
               <span>Order Now</span>
             </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-2 shadow-lg z-30"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Payment Methods Component */}
            <PaymentMethods
              amount={amount}
              currency={currency}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              orderDetails={{
                orderId,
                productName,
                customerEmail,
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
