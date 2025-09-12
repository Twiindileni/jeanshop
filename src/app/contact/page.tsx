"use client";

import { useState } from "react";
import { ButtonLoader } from "@/components/fashion-loader";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would send this to your backend
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const subject = formData.get('subject') as string;
      const message = formData.get('message') as string;
      
      console.log('Contact form submission:', { name, email, subject, message });
      
      setMessage({ type: 'success', text: 'Thank you for your message! We\'ll get back to you soon.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Sorry, there was an error sending your message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#B88972] to-[#A67B5B] py-16">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-white opacity-90">
            We'd love to hear from you. Get in touch with us today!
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-[#B88972] mb-6">Get in Touch</h2>
                <p className="text-gray-700 leading-relaxed mb-8">
                  Have a question about our products? Need help with sizing? Want to know more about 
                  our services? We're here to help! Reach out to us through any of the channels below.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#B88972] text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Phone</h3>
                    <p className="text-gray-600">+264 81 67 37 599</p>
                    <p className="text-sm text-gray-500">Mon-Fri: 9AM-6PM, Sat: 10AM-4PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#B88972] text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">info@jeansshop.com</p>
                    <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#B88972] text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Address</h3>
                    <p className="text-gray-600">
                      123 Fashion Street<br />
                      Windhoek, Namibia
                    </p>
                    <p className="text-sm text-gray-500">Visit our showroom</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-[#B88972] text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💬</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">WhatsApp</h3>
                    <p className="text-gray-600">+264 81 67 37 599</p>
                    <p className="text-sm text-gray-500">Quick responses via WhatsApp</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="bg-[#B88972] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#A67B5B] transition-colors">
                    <span className="text-lg">📘</span>
                  </a>
                  <a href="#" className="bg-[#B88972] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#A67B5B] transition-colors">
                    <span className="text-lg">📷</span>
                  </a>
                  <a href="#" className="bg-[#B88972] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#A67B5B] transition-colors">
                    <span className="text-lg">🐦</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#B88972] mb-6">Send us a Message</h2>
              
              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-100 border border-green-300 text-green-700' 
                    : 'bg-red-100 border border-red-300 text-red-700'
                }`}>
                  {message.text}
                </div>
              )}

              <form action={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="product">Product Question</option>
                    <option value="sizing">Sizing Help</option>
                    <option value="order">Order Support</option>
                    <option value="return">Returns & Exchanges</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B88972] focus:border-transparent"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#B88972] to-[#A67B5B] text-white rounded-lg px-6 py-4 font-semibold text-lg hover:from-[#A67B5B] hover:to-[#B88972] transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <ButtonLoader />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>📧</span>
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#B88972] mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Quick answers to common questions</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">What sizes do you carry?</h3>
              <p className="text-gray-600">
                We carry a wide range of sizes from XS to XXL for both men and women. 
                Check our size guide on each product page for detailed measurements.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">How long does shipping take?</h3>
              <p className="text-gray-600">
                Standard shipping takes 3-5 business days within Namibia. Express shipping 
                is available for next-day delivery in major cities.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">What is your return policy?</h3>
              <p className="text-gray-600">
                We offer a 30-day return policy for unworn items with tags attached. 
                Returns are free and easy - just contact us to get started.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Do you offer international shipping?</h3>
              <p className="text-gray-600">
                Currently, we ship within Namibia and to select neighboring countries. 
                Contact us for international shipping options and rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#B88972] mb-4">Visit Our Store</h2>
            <p className="text-xl text-gray-600">Come see our collection in person</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-96 bg-gray-200 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-6xl mb-4">🗺️</div>
                <p className="text-xl">Interactive Map Coming Soon</p>
                <p className="text-sm">123 Fashion Street, Windhoek, Namibia</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
