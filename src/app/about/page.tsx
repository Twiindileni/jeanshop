import { getSupabaseServerClient } from "@/lib/supabase/server";
import { LoadingImage } from "@/components/loading-image";

export default async function AboutPage() {
  const supabase = await getSupabaseServerClient();
  
  // Get cover image for hero section
  const { data: cover } = await supabase
    .from("covers")
    .select("path")
    .not('id', 'is', null)
    .single();

  const coverUrl = cover?.path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/covers/${cover.path}`
    : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        {coverUrl ? (
          <LoadingImage
            src={coverUrl}
            alt="About Us"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#B88972] to-[#A67B5B] flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-5xl font-bold mb-4">About Us</h1>
              <p className="text-xl">Crafting Quality Denim Since Day One</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">About Us</h1>
            <p className="text-xl">Crafting Quality Denim Since Day One</p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#B88972] mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Founded with a passion for quality denim and timeless style, our jeans shop has been 
                  dedicated to bringing you the finest selection of jeans that combine comfort, durability, 
                  and fashion-forward design.
                </p>
                <p>
                  We believe that great jeans are more than just clothing – they're a statement of 
                  personal style and confidence. That's why we carefully curate our collection to 
                  ensure every pair meets our high standards for quality and craftsmanship.
                </p>
                <p>
                  From classic straight cuts to modern skinny fits, from vintage washes to contemporary 
                  designs, we offer something for every taste and occasion. Our commitment to quality 
                  and customer satisfaction has made us a trusted name in denim fashion.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <div className="text-6xl mb-4">👖</div>
              <h3 className="text-2xl font-semibold text-[#B88972] mb-4">Quality First</h3>
              <p className="text-gray-600">
                Every pair of jeans in our collection is carefully selected for its quality, 
                comfort, and style. We believe in offering only the best to our customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#B88972] mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">What drives us every day</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-lg p-8 shadow-lg">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-semibold text-[#B88972] mb-4">Quality</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product in our collection is carefully 
                selected and tested to ensure it meets our high standards.
              </p>
            </div>
            
            <div className="text-center bg-white rounded-lg p-8 shadow-lg">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-2xl font-semibold text-[#B88972] mb-4">Customer Service</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're here to help you find the perfect 
                jeans and provide exceptional service every step of the way.
              </p>
            </div>
            
            <div className="text-center bg-white rounded-lg p-8 shadow-lg">
              <div className="text-5xl mb-4">🌱</div>
              <h3 className="text-2xl font-semibold text-[#B88972] mb-4">Sustainability</h3>
              <p className="text-gray-600">
                We're committed to sustainable fashion practices and work with brands that 
                share our values for environmental responsibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#B88972] mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600">The advantages of shopping with us</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-[#B88972] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">Quick and reliable shipping to your doorstep</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#B88972] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">↩️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm">Hassle-free returns within 30 days</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#B88972] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Expert Advice</h3>
              <p className="text-gray-600 text-sm">Get help finding the perfect fit and style</p>
            </div>
            
            <div className="text-center">
              <div className="bg-[#B88972] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure Shopping</h3>
              <p className="text-gray-600 text-sm">Safe and secure payment processing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#B88972] mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The people behind the brand</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center bg-white rounded-lg p-6 shadow-lg">
              <div className="w-24 h-24 bg-[#B88972] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-white">👨‍💼</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Assampta Gahutu</h3>
              <p className="text-[#B88972] font-medium mb-2">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                Passionate about denim and customer satisfaction. Assampta founded the company 
                with a vision to provide quality jeans for everyone in Namibia and beyond.
              </p>
            </div>
            
            <div className="text-center bg-white rounded-lg p-6 shadow-lg">
              <div className="w-24 h-24 bg-[#B88972] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-white">👩‍💻</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Cleo Thomas</h3>
              <p className="text-[#B88972] font-medium mb-2">Tech Team Lead</p>
              <p className="text-gray-600 text-sm">
                Cleo leads our technical development, ensuring our online platform 
                provides a seamless shopping experience for all our customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#B88972] to-[#A67B5B]">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Find Your Perfect Jeans?</h2>
          <p className="text-xl text-white mb-8 opacity-90">
            Browse our collection and discover the perfect fit for your style
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/products"
              className="bg-white text-[#B88972] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#B88972] transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
