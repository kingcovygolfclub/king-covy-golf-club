import React from 'react';
import { RotateCcw, Clock, Shield, CheckCircle } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Returns & Exchanges
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Easy returns and exchanges with our 30-day satisfaction guarantee
            </p>
          </div>
        </div>
      </section>

      {/* Return Policy Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">30-Day Returns</h3>
              <p className="text-gray-600">
                Return any item within 30 days of purchase for a full refund.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Shield className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Full Refund</h3>
              <p className="text-gray-600">
                Receive a full refund to your original payment method.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <RotateCcw className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Exchange</h3>
              <p className="text-gray-600">
                Exchange for a different size, color, or model hassle-free.
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <CheckCircle className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Authenticity Guaranteed</h3>
              <p className="text-gray-600">
                All items must be returned in original condition with authenticity certificate.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Return Process */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">How to Return</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Contact Us</h3>
                    <p className="text-gray-600">
                      Email us at returns@kingcovygolfclub.com or call (555) 123-4567 to initiate your return.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Get Return Label</h3>
                    <p className="text-gray-600">
                      We'll email you a prepaid return shipping label and return authorization number.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Package Item</h3>
                    <p className="text-gray-600">
                      Pack the item in its original packaging with all accessories, documentation, and authenticity certificate.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Ship & Track</h3>
                    <p className="text-gray-600">
                      Drop off at any UPS location or schedule a pickup. Track your return online.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Receive Refund</h3>
                    <p className="text-gray-600">
                      Once we receive and inspect your return, we'll process your refund within 3-5 business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Return Conditions */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Return Conditions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Eligible Items</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Items in original condition</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>With original packaging and tags</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Including authenticity certificate</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>All accessories and documentation</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Non-Returnable Items</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center space-x-2">
                      <RotateCcw className="h-4 w-4 text-red-600" />
                      <span>Custom engraved items</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <RotateCcw className="h-4 w-4 text-red-600" />
                      <span>Used or damaged items</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <RotateCcw className="h-4 w-4 text-red-600" />
                      <span>Items without authenticity certificate</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <RotateCcw className="h-4 w-4 text-red-600" />
                      <span>Items returned after 30 days</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 mb-2">Important Note</h4>
                  <p className="text-yellow-700 text-sm">
                    Custom engraved items cannot be returned unless there was an error in the engraving process. Please contact us immediately if you notice any issues with custom work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exchange Process */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Exchange Process</h2>
            <p className="text-lg text-gray-600">
              Need a different size, color, or model? We make exchanges easy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Size Exchange</h3>
              <p className="text-gray-600 text-sm mb-4">
                Need a different size? We'll exchange for the same item in your preferred size.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• No additional shipping charges</li>
                <li>• Quick processing (2-3 days)</li>
                <li>• Same return conditions apply</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Exchange</h3>
              <p className="text-gray-600 text-sm mb-4">
                Want a different color? We'll exchange for the same item in your preferred color.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• No additional shipping charges</li>
                <li>• Quick processing (2-3 days)</li>
                <li>• Same return conditions apply</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Exchange</h3>
              <p className="text-gray-600 text-sm mb-4">
                Want a different model? We'll exchange for a different item of equal or greater value.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Price difference applies</li>
                <li>• Quick processing (2-3 days)</li>
                <li>• Same return conditions apply</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Returns FAQ</h2>
            <p className="text-lg text-gray-600">
              Common questions about our return policy
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">How long do I have to return an item?</h4>
                <p className="text-gray-600 text-sm">You have 30 days from the date of purchase to return any item.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">Who pays for return shipping?</h4>
                <p className="text-gray-600 text-sm">We provide prepaid return shipping labels for all returns within the US.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">How long does it take to process a refund?</h4>
                <p className="text-gray-600 text-sm">Refunds are processed within 3-5 business days after we receive your return.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">Can I return a custom engraved item?</h4>
                <p className="text-gray-600 text-sm">Custom engraved items cannot be returned unless there was an error in the engraving process.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">What if my item arrives damaged?</h4>
                <p className="text-gray-600 text-sm">Contact us immediately. We'll work with the shipping carrier to resolve the issue.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">Can I exchange for store credit?</h4>
                <p className="text-gray-600 text-sm">Yes, you can request store credit instead of a refund to your original payment method.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">Do you accept international returns?</h4>
                <p className="text-gray-600 text-sm">Yes, but international customers are responsible for return shipping costs.</p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h4 className="font-medium text-gray-900 mb-2">What if I lose the authenticity certificate?</h4>
                <p className="text-gray-600 text-sm">Items without authenticity certificates cannot be returned. Please keep all documentation safe.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Return an Item?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Contact our customer service team to start your return process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="mailto:returns@kingcovygolfclub.com"
              className="inline-flex items-center border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
            >
              Email Returns
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
