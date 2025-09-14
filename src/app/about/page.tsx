import React from 'react';
import { Star, Shield, Truck, Users, Award, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              About King Covy Golf Club
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Your premier destination for premium golf equipment and collector's items
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded by passionate golfers who understand the importance of quality equipment, 
                  King Covy Golf Club has been serving the golfing community with premium clubs, 
                  putters, and accessories since our inception.
                </p>
                <p>
                  We specialize in boutique and collector's golf equipment, carefully curating 
                  each piece in our collection to ensure authenticity, quality, and exceptional 
                  value for our customers.
                </p>
                <p>
                  Our commitment extends beyond just selling equipment – we offer customization 
                  services including personal engravings, grip upgrades, and shaft modifications 
                  to help you create the perfect club for your game.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">K</span>
                  </div>
                  <p className="text-gray-600">Our Team Photo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              What drives us to provide exceptional service and products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality First</h3>
              <p className="text-gray-600">
                Every item in our collection is hand-picked for its quality, authenticity, 
                and condition. We never compromise on standards.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Authenticity Guaranteed</h3>
              <p className="text-gray-600">
                We provide detailed condition reports and authenticity certificates 
                for every piece, giving you complete confidence in your purchase.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Heart className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Service</h3>
              <p className="text-gray-600">
                Our team of golf enthusiasts provides personalized service, 
                helping you find the perfect equipment for your game.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">
              Golf professionals dedicated to serving you
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "John Smith",
                role: "Founder & CEO",
                description: "PGA Professional with 20+ years experience in golf equipment"
              },
              {
                name: "Sarah Johnson",
                role: "Head of Authenticity",
                description: "Expert in vintage and collectible golf equipment verification"
              },
              {
                name: "Mike Davis",
                role: "Customization Specialist",
                description: "Master craftsman specializing in club customization and repair"
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-100 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                  <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Browse our curated collection and discover why golfers trust King Covy Golf Club 
            for their equipment needs.
          </p>
          <a
            href="/shop"
            className="inline-flex items-center bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Shop Our Collection
          </a>
        </div>
      </section>
    </div>
  );
}
