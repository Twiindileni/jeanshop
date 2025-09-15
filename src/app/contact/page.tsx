import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ContactForm from "@/components/contact-form";
import ContactMessageDisplay from "@/components/contact-message-display";

// Server action to submit contact form
async function submitContactMessage(formData: FormData) {
  "use server";
  
  console.log('=== CONTACT FORM SUBMISSION START ===');
  
  const name = formData.get('name') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  console.log('Form data received:', { name, lastName, email, subject, message: message?.substring(0, 50) + '...' });

  if (!name || !email || !subject || !message) {
    console.log('Missing required fields');
    redirect('/contact?error=missing_fields');
    return;
  }

  try {
    console.log('Getting Supabase client...');
    const supabase = await getSupabaseServerClient();
    
    // Test connection first
    console.log('Testing Supabase connection...');
    const { data: testData, error: testError } = await supabase
      .from('contact_messages')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Supabase connection test failed:', testError);
      redirect('/contact?error=connection_failed');
      return;
    }
    
    console.log('Supabase connection successful');
    
    // Prepare data for insertion
    const insertData = {
      name: name.trim(),
      last_name: lastName?.trim() || null,
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    };
    
    console.log('Inserting contact message:', insertData);
    
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(insertData)
      .select();

    if (error) {
      console.error('Contact form submission error:', error);
      redirect('/contact?error=submission_failed&details=' + encodeURIComponent(error.message));
      return;
    }

    console.log('Contact message submitted successfully:', data);
    console.log('=== CONTACT FORM SUBMISSION SUCCESS ===');
  } catch (error) {
    console.error('Contact form unexpected error:', error);
    redirect('/contact?error=unexpected&details=' + encodeURIComponent(String(error)));
    return;
  }
  
  // Success redirect outside try-catch to avoid catching redirect errors
  redirect('/contact?success=1');
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string; details?: string; }>;
}) {
  const params = await searchParams;
  const success = params.success === '1';
  const error = params.error;
  const details = params.details;

  let message: { type: 'success' | 'error'; text: string } | null = null;
  
  if (success) {
    message = { type: 'success', text: 'Thank you for your message! We\'ll get back to you soon.' };
  } else if (error === 'missing_fields') {
    message = { type: 'error', text: 'Please fill in all required fields.' };
  } else if (error === 'submission_failed') {
    message = { type: 'error', text: `Failed to submit your message: ${details || 'Unknown error'}` };
  } else if (error === 'connection_failed') {
    message = { type: 'error', text: 'Database connection failed. Please try again later.' };
  } else if (error === 'unexpected') {
    message = { type: 'error', text: `An unexpected error occurred: ${details || 'Unknown error'}` };
  }

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
              
              <ContactMessageDisplay message={message} />

              <ContactForm onSubmit={submitContactMessage} />
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
