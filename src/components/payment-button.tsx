"use client";

import { useState } from "react";

export function PaymentButton() {
  const [showMessage, setShowMessage] = useState(false);

  const handleClick = () => {
    setShowMessage(true);
  };

  const handleClose = () => {
    setShowMessage(false);
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

      {showMessage && (
        <div className="fixed inset-0 bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-200 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative border-4 border-orange-300">
            {/* Construction Pattern Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl opacity-50"></div>
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 rounded-t-2xl"></div>
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-orange-400 hover:text-orange-600 transition-colors bg-white rounded-full p-1 shadow-md"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Payment message content */}
            <div className="text-center relative z-10">
              {/* Construction Icons */}
              <div className="flex justify-center items-center gap-2 mb-4">
                <div className="text-4xl">🚧</div>
                <div className="text-6xl">💳</div>
                <div className="text-4xl">🔧</div>
              </div>
              
              <h2 className="text-3xl font-bold text-orange-600 mb-2">
                Payment System
              </h2>
              <h3 className="text-xl font-semibold text-orange-500 mb-6">
                Under Construction
              </h3>
              
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl p-6 mb-6 border-2 border-orange-200">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-2xl">📱</span>
                  <p className="text-gray-700 font-medium">
                    For now, you can pay via PAY to CELL to:
                  </p>
                </div>
                <a 
                  href="tel:+264816737599"
                  className="text-3xl font-bold text-orange-600 hover:text-orange-700 transition-colors block"
                >
                  +264 81 67 37 599
                </a>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold text-yellow-600">⚠️ We're working hard</span> to bring you secure online payments. 
                  Thank you for your patience!
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gray-200 text-gray-700 rounded-lg px-4 py-3 font-medium hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <a
                  href="tel:+264816737599"
                  className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg px-4 py-3 font-medium hover:from-orange-600 hover:to-orange-700 transition-colors text-center shadow-lg"
                >
                  📱 PAY to CELL
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
