import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Premium Golf Equipment & Collectibles
            </h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Discover boutique and collector's golf clubs, putters, and accessories. 
              Each piece is carefully selected for quality and authenticity, with custom 
              engravings and personalization options available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center bg-white text-primary-600 font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="inline-flex items-center justify-center border-2 border-white text-white font-semibold px-8 py-4 rounded-lg hover:bg-white hover:text-primary-600 transition-colors">
                <Play className="mr-2 h-5 w-5" />
                Watch Video
              </button>
            </div>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">K</span>
                  </div>
                  <p className="text-gray-600">Featured Product Image</p>
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold">
              New Arrivals
            </div>
            <div className="absolute -bottom-4 -left-4 bg-green-400 text-green-900 px-4 py-2 rounded-full text-sm font-semibold">
              Free Shipping
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
