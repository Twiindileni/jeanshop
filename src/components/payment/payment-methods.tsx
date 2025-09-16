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

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      {/* Under Construction Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment System</h2>
        <h3 className="text-xl text-[#B88972] font-semibold mb-4">Under Construction</h3>
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

      {/* Construction Message */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-3">
          <div className="text-blue-500 text-2xl">💳</div>
          <div className="flex-1">
            <h4 className="text-blue-900 font-semibold mb-2">Payment Processing Coming Soon!</h4>
            <p className="text-blue-800 text-sm mb-3">
              We're setting up secure payment processing to accept:
            </p>
            
            <div className="grid grid-cols-2 gap-3 text-sm text-blue-700 mb-4">
              <div className="flex items-center space-x-2">
                <span>💳</span>
                <span>Credit/Debit Cards</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📱</span>
                <span>Mobile Money (MoMo)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🏦</span>
                <span>Bank Transfers</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>💰</span>
                <span>PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-[#B88972]/10 border border-[#B88972]/20 rounded-lg p-6 mb-6">
        <h4 className="text-[#B88972] font-semibold mb-3 text-center">Complete Your Order Now!</h4>
        <p className="text-gray-700 text-sm text-center mb-4">
          Contact us directly to place your order. We'll process your payment securely and ship your jeans right away!
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

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => {
            const message = `Hi! I'd like to order:\n\nProduct: ${orderDetails.productName}\nOrder ID: ${orderDetails.orderId}\nTotal: ${currency} ${formatAmount(amount)}\n\nHow can I complete the payment?`;
            window.open(`https://wa.me/264811234567?text=${encodeURIComponent(message)}`, '_blank');
          }}
          className="w-full bg-green-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>💬</span>
          <span>Order via WhatsApp</span>
        </button>
        
        <button
          onClick={() => {
            const subject = `Order Request - ${orderDetails.orderId}`;
            const body = `Hi,\n\nI'd like to place an order:\n\nProduct: ${orderDetails.productName}\nOrder ID: ${orderDetails.orderId}\nTotal: ${currency} ${formatAmount(amount)}\nCustomer Email: ${orderDetails.customerEmail}\n\nPlease let me know how to complete the payment.\n\nThank you!`;
            window.location.href = `mailto:orders@nubiajeans.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          }}
          className="w-full bg-gradient-to-r from-[#B88972] to-[#A67B5B] text-white rounded-lg px-6 py-3 font-medium hover:from-[#A67B5B] hover:to-[#B88972] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>📧</span>
          <span>Order via Email</span>
        </button>
      </div>

      {/* Timeline */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-gray-900 font-semibold mb-4 text-center">What happens next?</h4>
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start space-x-3">
            <span className="text-[#B88972] font-bold">1.</span>
            <span>Contact us with your order details</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-[#B88972] font-bold">2.</span>
            <span>We'll send you secure payment options (Bank transfer, Mobile Money, etc.)</span>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-[#B88972] font-bold">3.</span>
            <span>Once payment is confirmed, we'll ship your jeans within 24 hours</span>
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