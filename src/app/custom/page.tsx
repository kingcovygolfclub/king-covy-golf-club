import React from 'react';
import { Palette, Settings, Award, Star } from 'lucide-react';

export default function CustomPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Custom Orders
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Create your perfect golf equipment with our expert customization services
            </p>
          </div>
        </div>
      </section>

      {/* Customization Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Palette className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Engraving</h3>
              <p className="text-gray-600 mb-4">
                Add your name, initials, or custom text to make your clubs uniquely yours.
              </p>
              <p className="text-sm text-gray-500">
                Starting at $25 per club
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Settings className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Grip Customization</h3>
              <p className="text-gray-600 mb-4">
                Choose from premium grips in various colors and materials.
              </p>
              <p className="text-sm text-gray-500">
                Starting at $15 per grip
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Award className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Shaft Upgrades</h3>
              <p className="text-gray-600 mb-4">
                Upgrade to premium shafts for improved performance.
              </p>
              <p className="text-sm text-gray-500">
                Starting at $100 per shaft
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Customization Options */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Customization Options</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Engraving Services</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Personal names and initials</li>
                    <li>• Custom logos and designs</li>
                    <li>• Tournament or achievement text</li>
                    <li>• Multiple font styles available</li>
                    <li>• Various engraving locations</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Grip Options</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Premium leather grips</li>
                    <li>• Cord grips for better traction</li>
                    <li>• Oversized grips for comfort</li>
                    <li>• Custom colors and patterns</li>
                    <li>• Professional installation</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Shaft Upgrades</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Graphite and steel options</li>
                    <li>• Various flex ratings</li>
                    <li>• Weight and balance customization</li>
                    <li>• Professional fitting included</li>
                    <li>• Performance optimization</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Process */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Custom Order Process</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Consultation</h3>
                    <p className="text-gray-600">
                      Contact us to discuss your customization needs and get a personalized quote.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Design Approval</h3>
                    <p className="text-gray-600">
                      Review and approve your custom design before we begin work.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Professional Work</h3>
                    <p className="text-gray-600">
                      Our expert craftsmen complete your customizations with precision.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Quality Check</h3>
                    <p className="text-gray-600">
                      Every custom piece undergoes thorough quality inspection.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Delivery</h3>
                    <p className="text-gray-600">
                      Receive your custom equipment with premium packaging and care instructions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Customization Pricing</h2>
            <p className="text-lg text-gray-600">
              Transparent pricing for all our customization services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Basic Engraving</h3>
              <div className="text-2xl font-bold text-primary-600 mb-2">$25</div>
              <p className="text-sm text-gray-600 mb-4">per club</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Simple text engraving</li>
                <li>• Standard font</li>
                <li>• 1-2 week turnaround</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-primary-600">
              <div className="text-xs font-semibold text-primary-600 mb-2">MOST POPULAR</div>
              <h3 className="font-semibold text-gray-900 mb-4">Premium Engraving</h3>
              <div className="text-2xl font-bold text-primary-600 mb-2">$45</div>
              <p className="text-sm text-gray-600 mb-4">per club</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Custom fonts & styles</li>
                <li>• Multiple locations</li>
                <li>• 1-2 week turnaround</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Grip Upgrade</h3>
              <div className="text-2xl font-bold text-primary-600 mb-2">$35</div>
              <p className="text-sm text-gray-600 mb-4">per grip</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Premium grip selection</li>
                <li>• Professional installation</li>
                <li>• Same-day service</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Shaft Upgrade</h3>
              <div className="text-2xl font-bold text-primary-600 mb-2">$150</div>
              <p className="text-sm text-gray-600 mb-4">per shaft</p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Premium shaft options</li>
                <li>• Professional fitting</li>
                <li>• 3-5 day turnaround</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
            <p className="text-lg text-gray-600">
              See what our customers say about our custom work
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The engraving on my Scotty Cameron putter is absolutely perfect. The attention to detail is incredible."
              </p>
              <p className="text-sm font-semibold text-gray-900">- John M.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Professional service from start to finish. My custom grips feel amazing and look great."
              </p>
              <p className="text-sm font-semibold text-gray-900">- Sarah L.</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "The shaft upgrade made a huge difference in my game. Worth every penny!"
              </p>
              <p className="text-sm font-semibold text-gray-900">- Mike R.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Customize Your Equipment?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Contact our customization team to discuss your vision and get a personalized quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Custom Quote
            </a>
            <a
              href="mailto:custom@kingcovygolfclub.com"
              className="inline-flex items-center border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
            >
              Email Custom Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
