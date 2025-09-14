"use client";

import { useState } from "react";

export function PaymentButton() {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <button 
        onClick={handleClick}
        className="w-full bg-black text-white rounded-lg px-6 py-3 text-center font-medium hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
      >
        <span>💳</span>
        <span>Buy with Card</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-200 bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-white rounded-full p-2 shadow-lg z-30"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="bg-gradient-to-r from-[#B88972] to-[#A67B5B] text-white p-6 rounded-t-2xl">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span>💳</span>
                Secure Card Payment
              </h2>
              <p className="text-orange-100 mt-1">Enter your payment details below</p>
            </div>

            {/* Card Form */}
            <div className="p-6 relative">
              {/* Coming Soon overlay */}
              <div className="absolute inset-0 bg-white bg-opacity-95 rounded-b-2xl z-20 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="mb-4">
                    <span className="text-6xl">🚧</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#B88972] mb-2">Coming Soon!</h3>
                  <p className="text-gray-600 mb-6 max-w-sm">
                    We're working hard to bring you secure online card payments. 
                    Stay tuned for this exciting feature!
                  </p>
                  
                  {/* Current payment option */}
                  <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-[#B88972]">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-2xl">📱</span>
                      <p className="text-gray-700 font-medium">
                        For now, pay via PAY to CELL:
                      </p>
                    </div>
                    <a 
                      href="tel:+264816737599"
                      className="text-2xl font-bold text-[#B88972] hover:text-[#A67B5B] transition-colors block"
                    >
                      +264 81 67 37 599
                    </a>
                  </div>
                </div>
              </div>

              {/* Card form (grayed out) */}
              <div className="space-y-6 opacity-30">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent pl-12"
                      disabled
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
                      disabled
                    />
                  </div>
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
                    disabled
                  />
                </div>

                {/* Billing Address */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Billing Address</h4>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      placeholder="123 Main Street"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
                      disabled
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="Windhoek"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        placeholder="9000"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Security Features */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span>🔒</span>
                    <span className="font-semibold text-green-800">Secure Payment</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>

                {/* Payment Button */}
                <button
                  className="w-full bg-gradient-to-r from-[#B88972] to-[#A67B5B] text-white rounded-lg px-6 py-4 text-lg font-semibold hover:from-[#A67B5B] hover:to-[#B88972] transition-all duration-300 flex items-center justify-center gap-2"
                  disabled
                >
                  <span>🔐</span>
                  <span>Pay Securely</span>
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 rounded-b-2xl">
              <div className="flex justify-between items-center">
                <button
                  onClick={handleClose}
                  className="bg-gray-200 text-gray-700 rounded-lg px-6 py-2 font-medium hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <a
                  href="tel:+264816737599"
                  className="bg-gradient-to-r from-[#B88972] to-[#A67B5B] text-white rounded-lg px-6 py-2 font-medium hover:from-[#A67B5B] hover:to-[#B88972] transition-colors shadow-lg flex items-center gap-2"
                >
                  <span>📱</span>
                  <span>PAY to CELL</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
