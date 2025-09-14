import React from 'react';
import { Truck, Clock, Shield, Globe } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Shipping Information
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Fast, secure, and reliable shipping for all your golf equipment needs
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Truck className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Standard Shipping</h3>
              <p className="text-gray-600 mb-4">
                Free on orders over $200. 5-7 business days.
              </p>
              <p className="text-sm text-gray-500">
                Orders under $200: $15 flat rate
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Express Shipping</h3>
              <p className="text-gray-600 mb-4">
                2-3 business days delivery.
              </p>
              <p className="text-sm text-gray-500">
                $25 flat rate
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Premium Protection</h3>
              <p className="text-gray-600 mb-4">
                Insured shipping with signature required.
              </p>
              <p className="text-sm text-gray-500">
                $35 flat rate
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Shipping Details */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Shipping Details</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Processing Time</h3>
                  <p className="text-gray-600">
                    All orders are processed within 1-2 business days. Custom orders may take 3-5 business days to process due to personalization requirements.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Delivery Areas</h3>
                  <p className="text-gray-600 mb-3">
                    We ship to all 50 US states, Canada, and select international destinations.
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Globe className="h-4 w-4" />
                    <span>International shipping available upon request</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tracking Information</h3>
                  <p className="text-gray-600">
                    You'll receive a tracking number via email once your order ships. Track your package in real-time through our shipping partners.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Special Handling</h3>
                  <p className="text-gray-600">
                    All golf equipment is carefully packaged with protective materials to ensure safe delivery. Premium items receive extra protection and signature confirmation.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Shipping FAQ</h2>
              
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Can I change my shipping address after placing an order?</h4>
                  <p className="text-gray-600 text-sm">Yes, contact us immediately if your order hasn't shipped yet. We'll do our best to update the address.</p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-900 mb-2">What if my package is damaged during shipping?</h4>
                  <p className="text-gray-600 text-sm">Contact us immediately. We'll work with the shipping carrier to resolve the issue and ensure you receive a replacement.</p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Do you ship to PO Boxes?</h4>
                  <p className="text-gray-600 text-sm">Yes, we can ship to PO Boxes using USPS. Express shipping may not be available for PO Box addresses.</p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Can I schedule a delivery time?</h4>
                  <p className="text-gray-600 text-sm">Premium Protection shipping includes delivery scheduling options. Contact us for more details.</p>
                </div>
                
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="font-medium text-gray-900 mb-2">What happens if I'm not home for delivery?</h4>
                  <p className="text-gray-600 text-sm">The carrier will leave a notice and attempt redelivery. You can also pick up at their local facility.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* International Shipping */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">International Shipping</h2>
            <p className="text-lg text-gray-600">
              We ship worldwide with full insurance and tracking
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Canada</h3>
              <p className="text-sm text-gray-600">5-10 business days</p>
              <p className="text-sm text-gray-500">$25 flat rate</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Europe</h3>
              <p className="text-sm text-gray-600">7-14 business days</p>
              <p className="text-sm text-gray-500">$45 flat rate</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Asia Pacific</h3>
              <p className="text-sm text-gray-600">10-21 business days</p>
              <p className="text-sm text-gray-500">$55 flat rate</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-2">Other Regions</h3>
              <p className="text-sm text-gray-600">Contact us for quote</p>
              <p className="text-sm text-gray-500">Custom pricing</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Questions About Shipping?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Our customer service team is here to help with all your shipping needs.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </div>
  );
}
