'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Award, Zap } from 'lucide-react';
import { AnimatedSection, AnimatedText, AnimatedButton } from '@/components/ui/AnimatedSection';

const categories = [
  {
    name: 'Drivers',
    slug: 'drivers',
    description: 'Premium drivers from top manufacturers for maximum distance and accuracy',
    image: 'https://king-covy-assets.s3.amazonaws.com/categories/drivers.png',
    count: '24 products',
    brands: ['Titleist', 'Callaway', 'TaylorMade', 'Ping'],
    icon: '🏌️',
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Irons',
    slug: 'irons',
    description: 'Professional-grade iron sets for precision and control',
    image: 'https://king-covy-assets.s3.amazonaws.com/categories/irons.png',
    count: '18 products',
    brands: ['Mizuno', 'Titleist', 'Callaway', 'TaylorMade'],
    icon: '⚡',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    name: 'Putters',
    slug: 'putters',
    description: 'Premium putters including collectible and custom models',
    image: 'https://king-covy-assets.s3.amazonaws.com/categories/putters.png',
    count: '32 products',
    brands: ['Scotty Cameron', 'Odyssey', 'Ping', 'Bettinardi'],
    icon: '🎯',
    color: 'from-teal-500 to-teal-600'
  },
  {
    name: 'Wedges',
    slug: 'wedges',
    description: 'Specialized wedges for short game mastery',
    image: 'https://king-covy-assets.s3.amazonaws.com/categories/wedges.png',
    count: '15 products',
    brands: ['Titleist', 'Callaway', 'Cleveland', 'TaylorMade'],
    icon: '🔧',
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'Fairway Woods',
    slug: 'fairway-woods',
    description: 'Versatile fairway woods for all course conditions',
    image: 'https://king-covy-assets.s3.amazonaws.com/categories/fairway%20woods.png',
    count: '12 products',
    brands: ['Titleist', 'Callaway', 'TaylorMade', 'Ping'],
    icon: '🌳',
    color: 'from-green-500 to-green-600'
  },
  {
    name: 'Hybrids',
    slug: 'hybrids',
    description: 'Easy-to-hit hybrids for improved accuracy',
    image: 'https://king-covy-assets.s3.amazonaws.com/categories/hybrids.png',
    count: '8 products',
    brands: ['Titleist', 'Callaway', 'TaylorMade', 'Ping'],
    icon: '🔀',
    color: 'from-orange-500 to-orange-600'
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Essential golf accessories and equipment',
    image: 'https://king-covy-assets.s3.amazonaws.com/categories/accessories.png',
    count: '45 products',
    brands: ['Various'],
    icon: '🎒',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    name: 'Limited Release',
    slug: 'collectibles',
    description: 'Exclusive and limited edition golf equipment',
    image: 'https://king-covy-assets.s3.amazonaws.com/categories/collectibles.png',
    count: '28 products',
    brands: ['Various Vintage'],
    icon: '💎',
    color: 'from-pink-500 to-pink-600'
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <AnimatedSection className="bg-gradient-to-r from-emerald-600 via-teal-700 to-blue-800 py-20 relative overflow-hidden">
        {/* Floating elements */}
        {typeof window !== 'undefined' && [...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animation: 'float 6s ease-in-out infinite'
            }}
          />
        ))}
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <AnimatedText 
              text="Shop by Category"
              className="text-4xl lg:text-6xl font-bold text-white mb-6"
            />
            <AnimatedSection variant="fadeInUp" delay={0.2}>
              <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
                Browse our carefully curated collection of premium golf equipment
              </p>
            </AnimatedSection>
            
            <AnimatedSection variant="fadeInUp" delay={0.4}>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm">
                  <Star className="inline h-4 w-4 mr-2" />
                  Premium Quality
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm">
                  <Award className="inline h-4 w-4 mr-2" />
                  Expert Curated
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/90 text-sm">
                  <Zap className="inline h-4 w-4 mr-2" />
                  Fast Shipping
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
        `}</style>
      </AnimatedSection>

      {/* Categories Grid */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection variant="fadeInUp" className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">All Categories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect equipment for your game with our expertly curated collection
            </p>
          </AnimatedSection>

          <AnimatedSection variant="staggerContainer" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <AnimatedSection
                key={category.slug}
                variant="scaleIn"
                delay={index * 0.1}
                className="group"
              >
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-emerald-300 transform hover:-translate-y-2"
                >
                  {/* Category Image */}
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  </div>

                  {/* Category Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {category.name}
                      </h3>
                      <span className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-semibold">
                        {category.count}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                    
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2 font-medium">Popular Brands:</p>
                      <div className="flex flex-wrap gap-1">
                        {category.brands.slice(0, 3).map((brand, brandIndex) => (
                          <span
                            key={brandIndex}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg font-medium"
                          >
                            {brand}
                          </span>
                        ))}
                        {category.brands.length > 3 && (
                          <span className="text-xs text-gray-500 font-medium">
                            +{category.brands.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-emerald-600 text-sm font-semibold group-hover:text-emerald-700 transition-colors">
                      Shop {category.name}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Brands Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection variant="fadeInUp" className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Brands</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We carry equipment from the most trusted names in golf
            </p>
          </AnimatedSection>
          
          <AnimatedSection variant="staggerContainer" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              { name: 'Titleist', logo: 'https://king-covy-assets.s3.amazonaws.com/brands/titleist-logo.svg' },
              { name: 'Callaway', logo: 'https://king-covy-assets.s3.amazonaws.com/brands/callaway-logo.svg' },
              { name: 'TaylorMade', logo: 'https://king-covy-assets.s3.amazonaws.com/brands/taylormade-logo.svg' },
              { name: 'Ping', logo: 'https://king-covy-assets.s3.amazonaws.com/brands/ping-logo.svg' },
              { name: 'Mizuno', logo: 'https://king-covy-assets.s3.amazonaws.com/brands/mizuno-logo.svg' },
              { name: 'Scotty Cameron', logo: 'https://king-covy-assets.s3.amazonaws.com/brands/scotty-cameron-logo.svg' },
              { name: 'Odyssey', logo: 'https://king-covy-assets.s3.amazonaws.com/brands/odyssey-logo.svg' },
              { name: 'Cleveland', logo: 'https://king-covy-assets.s3.amazonaws.com/brands/cleveland-logo.svg' },
              { name: 'Bettinardi', logo: 'https://king-covy-assets.s3.amazonaws.com/brands/bettinardi-logo.svg' },
              { name: 'Cobra', logo: 'https://king-covy-assets.s3.amazonaws.com/brands/cobra-logo.svg' },
              { name: 'Wilson', logo: 'https://king-covy-assets.s3.amazonaws.com/brands/wilson-logo.svg' },
              { name: 'Srixon', logo: 'https://king-covy-assets.s3.amazonaws.com/brands/srixon-logo.svg' }
            ].map((brand, index) => (
              <AnimatedSection
                key={brand.name}
                variant="scaleIn"
                delay={index * 0.05}
                className="text-center group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200 transform hover:-translate-y-1">
                  <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
                    <Image
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      width={64}
                      height={64}
                      className="object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">
                    {brand.name}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-700 to-blue-800 relative overflow-hidden">
        {/* Animated background elements */}
        {typeof window !== 'undefined' && [...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animation: 'float 4s ease-in-out infinite'
            }}
          />
        ))}
        
        <AnimatedSection className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Our team of experts can help you find the perfect equipment or source rare items for your collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <AnimatedButton
              href="/contact"
              variant="secondary"
              size="lg"
              delay={0.2}
            >
              Contact Us
            </AnimatedButton>
            <AnimatedButton
              href="/shop"
              variant="outline"
              size="lg"
              delay={0.4}
              className="border-white text-white hover:bg-white hover:text-emerald-600"
            >
              Browse All Products
            </AnimatedButton>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}