"use client";

import { useState } from "react";

interface PaymentMethodsProps {
  amount: number; // in cents
  currency: string;
  onPaymentSuccess: (paymentDetails: any) => void;
  onPaymentError: (error: string) => void;
  orderDetails: {
    orderId: string;
    productName: string;
    customerEmail: string;
  };
}

export default function PaymentMethods({
  amount,
  currency,
  onPaymentSuccess,
  onPaymentError,
  orderDetails
}: PaymentMethodsProps) {
  const formatAmount = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  const handleStripePayment = () => {
    // Redirect to Stripe checkout
    window.open('https://buy.stripe.com/test_3cIeVe0lB27r55JdZqbfO00', '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      {/* Payment Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">💳</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Payment Method</h2>
        <h3 className="text-lg text-[#B88972] mb-4">Secure & Fast Checkout</h3>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Order Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Product:</span>
            <span className="font-medium">{orderDetails.productName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium text-sm">{orderDetails.orderId}</span>
          </div>
          <div className="border-t pt-2 mt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>Total Amount:</span>
              <span className="text-[#B88972]">{currency} {formatAmount(amount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4 mb-6">
        {/* Stripe Card Payment */}
        <button
          onClick={handleStripePayment}
          className="w-full bg-blue-600 text-white rounded-lg px-6 py-4 font-medium hover:bg-blue-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg"
        >
          <span className="text-2xl">💳</span>
          <div className="text-left">
            <div className="font-semibold">Pay with Card</div>
            <div className="text-sm opacity-90">Secure payment via Stripe</div>
          </div>
        </button>

        {/* Coming Soon Options */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="text-gray-700 font-semibold mb-3 text-center">More Payment Options Coming Soon</h4>
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-center space-x-2 opacity-60">
              <span>📱</span>
              <span>Mobile Money (MoMo)</span>
            </div>
            <div className="flex items-center space-x-2 opacity-60">
              <span>🏦</span>
              <span>Bank Transfers</span>
            </div>
            <div className="flex items-center space-x-2 opacity-60">
              <span>💰</span>
              <span>PayPal</span>
            </div>
            <div className="flex items-center space-x-2 opacity-60">
              <span>📱</span>
              <span>Apple Pay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alternative Contact Information */}
      <div className="bg-[#B88972]/10 border border-[#B88972]/20 rounded-lg p-6 mb-6">
        <h4 className="text-[#B88972] font-semibold mb-3 text-center">Need Help or Prefer Other Payment Methods?</h4>
        <p className="text-gray-700 text-sm text-center mb-4">
          Contact us directly for alternative payment options or if you need assistance with your order!
        </p>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-[#B88972]">📧</span>
            <span className="font-medium">Email:</span>
            <a href="mailto:orders@nubiajeans.com" className="text-[#B88972] hover:underline">
              orders@nubiajeans.com
            </a>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-[#B88972]">📱</span>
            <span className="font-medium">WhatsApp:</span>
            <a href="https://wa.me/264816737599" className="text-[#B88972] hover:underline">
              +264 81 673 7599
            </a>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-[#B88972]">📞</span>
            <span className="font-medium">Phone:</span>
            <span className="text-gray-700">+264 61 234 567</span>
          </div>
        </div>
      </div>

      {/* Alternative Contact Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={() => {
            const message = `Hi! I'd like to inquire about payment options for:\n\nProduct: ${orderDetails.productName}\nOrder ID: ${orderDetails.orderId}\nTotal: ${currency} ${formatAmount(amount)}\n\nCan you help me with alternative payment methods?`;
            window.open(`https://wa.me/264816737599?text=${encodeURIComponent(message)}`, '_blank');
          }}
          className="w-full bg-green-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>💬</span>
          <span>WhatsApp Support</span>
        </button>
        
        <button
          onClick={() => {
            const subject = `Payment Inquiry - ${orderDetails.orderId}`;
            const body = `Hi,\n\nI need help with payment options for:\n\nProduct: ${orderDetails.productName}\nOrder ID: ${orderDetails.orderId}\nTotal: ${currency} ${formatAmount(amount)}\nCustomer Email: ${orderDetails.customerEmail}\n\nCould you provide alternative payment methods?\n\nThank you!`;
            window.location.href = `mailto:orders@nubiajeans.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          }}
          className="w-full bg-gradient-to-r from-[#B88972] to-[#A67B5B] text-white rounded-lg px-4 py-3 font-medium hover:from-[#A67B5B] hover:to-[#B88972] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>📧</span>
          <span>Email Support</span>
        </button>
      </div>

      {/* Timeline */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-gray-900 font-semibold mb-4 text-center">What happens next?</h4>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start space-x-3">
            <span className="text-[#B88972] font-bold">1.</span>
            <span>Choose your payment method - Card payment via Stripe or contact us for alternatives</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-[#B88972] font-bold">2.</span>
            <span>Complete secure payment through Stripe or arrange alternative payment</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-[#B88972] font-bold">3.</span>
            <span>Once payment is confirmed, we'll process and ship your jeans within 24 hours</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-[#B88972] font-bold">4.</span>
            <span>Track your order and receive it within 2-5 business days</span>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-green-600">🔒</span>
          <p className="text-sm text-green-800">
            <strong>Secure & Trusted:</strong> Your personal information is safe with us. 
            We use secure payment methods and never share your details.
          </p>
        </div>
      </div>
    </div>
  );
}