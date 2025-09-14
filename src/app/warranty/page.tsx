import React from 'react';
import { Shield, Clock, Wrench, CheckCircle } from 'lucide-react';

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Warranty Information
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Comprehensive warranty coverage for all your premium golf equipment
            </p>
          </div>
        </div>
      </section>

      {/* Warranty Coverage */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Manufacturer Warranty</h3>
              <p className="text-gray-600 mb-4">
                All new equipment comes with full manufacturer warranty coverage.
              </p>
              <p className="text-sm text-gray-500">
                Coverage varies by brand and product type
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Extended Coverage</h3>
              <p className="text-gray-600 mb-4">
                Additional warranty options available at purchase.
              </p>
              <p className="text-sm text-gray-500">
                Up to 3 years additional coverage
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Wrench className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Repair Services</h3>
              <p className="text-gray-600 mb-4">
                Professional repair and maintenance services available.
              </p>
              <p className="text-sm text-gray-500">
                Authorized service centers nationwide
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Warranty Details */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Warranty Coverage</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">New Equipment</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Full manufacturer warranty included</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Coverage for manufacturing defects</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Free replacement or repair</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Warranty registration assistance</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Used Equipment</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>30-day satisfaction guarantee</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Authenticity guarantee</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Condition report provided</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Professional inspection completed</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Custom Work</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>1-year warranty on custom work</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Coverage for workmanship defects</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Free rework if issues arise</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Quality guarantee on all customizations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Warranty Process */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Warranty Claims</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                    <p className="text-gray-600">
                      Email warranty@kingcovygolfclub.com or call (555) 123-4567 to report the issue.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Provide Documentation</h3>
                    <p className="text-gray-600">
                      Send photos of the issue, purchase receipt, and warranty certificate.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Get Authorization</h3>
                    <p className="text-gray-600">
                      We'll review your claim and provide warranty service authorization.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Ship for Service</h3>
                    <p className="text-gray-600">
                      We'll provide prepaid shipping label to send your item for warranty service.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Receive Resolution</h3>
                    <p className="text-gray-600">
                      Get your repaired or replaced item back, fully covered under warranty.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand-Specific Warranties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Brand Warranties</h2>
            <p className="text-lg text-gray-600">
              Coverage varies by manufacturer
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Titleist</h3>
              <p className="text-sm text-gray-600 mb-2">2 years on clubs</p>
              <p className="text-sm text-gray-500">Coverage for defects in materials and workmanship</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Callaway</h3>
              <p className="text-sm text-gray-600 mb-2">2 years on clubs</p>
              <p className="text-sm text-gray-500">Full warranty on manufacturing defects</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">TaylorMade</h3>
              <p className="text-sm text-gray-600 mb-2">2 years on clubs</p>
              <p className="text-sm text-gray-500">Comprehensive coverage on all products</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Scotty Cameron</h3>
              <p className="text-sm text-gray-600 mb-2">2 years on putters</p>
              <p className="text-sm text-gray-500">Premium warranty coverage</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Ping</h3>
              <p className="text-sm text-gray-600 mb-2">2 years on clubs</p>
              <p className="text-sm text-gray-500">Lifetime warranty on certain components</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Mizuno</h3>
              <p className="text-sm text-gray-600 mb-2">2 years on clubs</p>
              <p className="text-sm text-gray-500">Full warranty on craftsmanship</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Odyssey</h3>
              <p className="text-sm text-gray-600 mb-2">2 years on putters</p>
              <p className="text-sm text-gray-500">Comprehensive putter coverage</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">Other Brands</h3>
              <p className="text-sm text-gray-600 mb-2">Varies by manufacturer</p>
              <p className="text-sm text-gray-500">Contact us for specific coverage details</p>
            </div>
          </div>
        </div>
      </section>

      {/* Warranty FAQ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Warranty FAQ</h2>
            <p className="text-lg text-gray-600">
              Common questions about our warranty coverage
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">What is covered under warranty?</h4>
                <p className="text-gray-600 text-sm">Manufacturing defects in materials and workmanship are covered. Normal wear and tear is not covered.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">How long is the warranty period?</h4>
                <p className="text-gray-600 text-sm">Most manufacturers offer 2-year warranties on golf clubs. Custom work has a 1-year warranty.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">What if I lose my warranty card?</h4>
                <p className="text-gray-600 text-sm">We can help you register your warranty with the manufacturer using your purchase receipt.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">Can I extend my warranty?</h4>
                <p className="text-gray-600 text-sm">Yes, we offer extended warranty options at the time of purchase for additional coverage.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">What is not covered under warranty?</h4>
                <p className="text-gray-600 text-sm">Normal wear and tear, misuse, accidents, and damage from improper storage are not covered.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">How do I file a warranty claim?</h4>
                <p className="text-gray-600 text-sm">Contact us with photos of the issue, your receipt, and warranty information. We'll handle the claim process.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">Who pays for warranty shipping?</h4>
                <p className="text-gray-600 text-sm">We provide prepaid shipping labels for warranty claims within the US.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">Can I get a refund instead of repair?</h4>
                <p className="text-gray-600 text-sm">Warranty coverage typically includes repair or replacement. Refunds are handled through our return policy.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Warranty Service?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Contact our warranty team for assistance with any warranty claims or questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="mailto:warranty@kingcovygolfclub.com"
              className="inline-flex items-center border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
            >
              Email Warranty
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
