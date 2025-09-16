"use client";

import { useState } from "react";

export function SizeGuide() {
  const [isOpen, setIsOpen] = useState(false);

  const sizeChart = [
    { size: "XS", waist: "24-25", hips: "34-35", inseam: "30-32" },
    { size: "S", waist: "26-27", hips: "36-37", inseam: "30-32" },
    { size: "M", waist: "28-29", hips: "38-39", inseam: "30-32" },
    { size: "L", waist: "30-32", hips: "40-42", inseam: "30-32" },
    { size: "XL", waist: "33-35", hips: "43-45", inseam: "30-32" },
    { size: "XXL", waist: "36-38", hips: "46-48", inseam: "30-32" },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-[#B88972] underline text-sm hover:text-[#A67B5B] transition-colors"
      >
        📏 Size Guide
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Size Guide</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Size Chart */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Women's Jeans Size Chart (inches)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-[#B88972]/10">
                        <th className="border border-gray-300 p-2 text-left">Size</th>
                        <th className="border border-gray-300 p-2 text-left">Waist</th>
                        <th className="border border-gray-300 p-2 text-left">Hips</th>
                        <th className="border border-gray-300 p-2 text-left">Inseam</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeChart.map((row) => (
                        <tr key={row.size} className="hover:bg-gray-50">
                          <td className="border border-gray-300 p-2 font-medium">{row.size}</td>
                          <td className="border border-gray-300 p-2">{row.waist}"</td>
                          <td className="border border-gray-300 p-2">{row.hips}"</td>
                          <td className="border border-gray-300 p-2">{row.inseam}"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* How to Measure */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">How to Measure</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-3">
                    <span className="font-medium text-[#B88972]">Waist:</span>
                    <span>Measure around your natural waistline, keeping the tape comfortably loose.</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="font-medium text-[#B88972]">Hips:</span>
                    <span>Measure around the fullest part of your hips, about 8 inches below your waist.</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="font-medium text-[#B88972]">Inseam:</span>
                    <span>Measure from the crotch seam to the bottom of your ankle.</span>
                  </div>
                </div>
              </div>

              {/* Fit Guide */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Fit Guide</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>Skinny:</strong> Fitted through hip and thigh, tapered leg</p>
                  <p><strong>Straight:</strong> Classic fit, straight leg from hip to ankle</p>
                  <p><strong>Bootcut:</strong> Fitted through hip and thigh, slightly flared at bottom</p>
                  <p><strong>Wide Leg:</strong> Relaxed through hip and thigh, wide leg opening</p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Still unsure about sizing? Contact us for personalized fit advice!
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-[#B88972] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#A67B5B] transition-colors"
                >
                  Got it!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

