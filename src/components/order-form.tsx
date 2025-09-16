"use client";

import { useState } from "react";
import { ButtonLoader } from "./fashion-loader";
import { PaymentButton } from "./payment-button";

interface OrderFormProps {
  productId: string;
  productTitle: string;
  productPrice: number;
  onSubmit: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
}

export function OrderForm({ productId, productTitle, productPrice, onSubmit }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customerEmail, setCustomerEmail] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await onSubmit(formData);
      if (result.error) {
        setError(result.error);
      } else {
        // Success - the parent component should handle redirect
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrice = productPrice * quantity;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#B88972] mb-2">Place Your Order</h2>
        <p className="text-gray-600">Complete your order for <strong>{productTitle}</strong></p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
          {error}
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <input type="hidden" name="productId" value={productId} />
        
        {/* Product Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Order Summary</h3>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{productTitle}</span>
            <span className="font-semibold">N${(productPrice / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <label className="text-gray-600">
              Quantity:
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                name="quantity"
                className="ml-2 w-20 px-2 py-1 border rounded text-center"
              />
            </label>
            <span className="font-bold text-lg text-[#B88972]">
              Total: N${(totalPrice / 100).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Customer Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="customerName"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="customerEmail"
                required
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="customerPhone"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
              placeholder="Enter your phone number (optional)"
            />
          </div>
        </div>

        {/* Shipping Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Shipping Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <textarea
              name="shippingAddress"
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
              placeholder="Enter your complete address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="shippingCity"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
                placeholder="Enter your city"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                name="shippingPostalCode"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
                placeholder="Postal code"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                name="shippingCountry"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
              >
                <option value="Namibia">Namibia</option>
                <option value="South Africa">South Africa</option>
                <option value="Botswana">Botswana</option>
                <option value="Zambia">Zambia</option>
                <option value="Zimbabwe">Zimbabwe</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
            placeholder="Any special instructions or notes for your order (optional)"
          />
        </div>

        {/* Payment Section */}
        <div className="pt-4 space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Options</h3>
            <p className="text-sm text-gray-600 mb-4">Choose your preferred payment method</p>
          </div>
          
          {/* Place Order Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#B88972] to-[#A67B5B] text-white rounded-lg px-6 py-4 text-center font-semibold text-lg hover:from-[#A67B5B] hover:to-[#B88972] transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <ButtonLoader />
                <span>Processing Order...</span>
              </>
            ) : (
              <>
                <span>🛍️</span>
                <span>Place Order - N${(totalPrice / 100).toFixed(2)}</span>
              </>
            )}
          </button>
          
          {/* Card Payment Button */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">or</p>
            <PaymentButton 
              amount={totalPrice * 100} // Convert to cents
              currency="NAD"
              productName={productTitle}
              orderId={`temp-${Date.now()}-${productId}`} // Temporary order ID
              customerEmail={customerEmail}
              onPaymentSuccess={(details) => {
                console.log('Payment successful:', details);
                // Handle successful payment
              }}
              onPaymentError={(error) => {
                setError(`Payment failed: ${error}`);
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
