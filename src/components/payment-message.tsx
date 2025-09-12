"use client";

import { useState } from "react";

interface PaymentMessageProps {
  onClose?: () => void;
}

export function PaymentMessage({ onClose }: PaymentMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Payment message content */}
        <div className="text-center">
          <div className="text-6xl mb-4">💳</div>
          <h2 className="text-2xl font-bold text-[#B88972] mb-4">
            Card Payment Coming Soon!
          </h2>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-700 mb-3">
              For now, you can pay by calling:
            </p>
            <a 
              href="tel:+264816737599"
              className="text-2xl font-bold text-[#B88972] hover:text-[#A67B5B] transition-colors"
            >
              +264 81 67 37 599
            </a>
          </div>

          <p className="text-gray-600 mb-6">
            Thank you for your patience! We're working hard to bring you secure online payments.
          </p>

          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-200 text-gray-700 rounded-lg px-4 py-2 font-medium hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <a
              href="tel:+264816737599"
              className="flex-1 bg-[#B88972] text-white rounded-lg px-4 py-2 font-medium hover:bg-[#A67B5B] transition-colors text-center"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for showing payment message
export function usePaymentMessage() {
  const [showMessage, setShowMessage] = useState(false);

  const showPaymentMessage = () => setShowMessage(true);
  const hidePaymentMessage = () => setShowMessage(false);

  return {
    showPaymentMessage,
    hidePaymentMessage,
    PaymentMessageComponent: showMessage ? () => <PaymentMessage onClose={hidePaymentMessage} /> : null
  };
}
