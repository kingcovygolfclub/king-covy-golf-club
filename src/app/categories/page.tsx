import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    name: 'Drivers',
    slug: 'drivers',
    description: 'Premium drivers from top manufacturers for maximum distance and accuracy',
    image: 'https://king-covy-assets.s3.amazonaws.com/categories/drivers.svg',
    count: '24 products',
    brands: ['Titleist', 'Callaway', 'TaylorMade', 'Ping']
  },
  {
    name: 'Irons',
    slug: 'irons',
    description: 'Professional-grade iron sets for precision and control',
    image: 'https://king-covy-assets.s3.amazonaws.com/categories/irons.svg',
    count: '18 products',
    brands: ['Mizuno', 'Titleist', 'Callaway', 'TaylorMade']
  },
  {
    name: 'Putters',
    slug: 'putters',
    description: 'Premium putters including collectible and custom models',
    image: 'https://king-covy-assets.s3.amazonaws.com/categories/putters.svg',
    count: '32 products',
    brands: ['Scotty Cameron', 'Odyssey', 'Ping', 'Bettinardi']
  },
  {
    name: 'Wedges',
    slug: 'wedges',
    description: 'Specialized wedges for short game mastery',
    image: 'https://king-covy-assets.s3.amazonaws.com/categories/wedges.svg',
    count: '15 products',
    brands: ['Titleist', 'Callaway', 'Cleveland', 'TaylorMade']
  },
  {
    name: 'Fairway Woods',
    slug: 'fairway-woods',
    description: 'Versatile fairway woods for all course conditions',
    image: 'https://king-covy-assets.s3.amazonaws.com/categories/fairway-woods.svg',
    count: '12 products',
    brands: ['Titleist', 'Callaway', 'TaylorMade', 'Ping']
  },
  {
    name: 'Hybrids',
    slug: 'hybrids',
    description: 'Easy-to-hit hybrids for improved accuracy',
    image: 'https://king-covy-assets.s3.amazonaws.com/categories/hybrids.svg',
    count: '8 products',
    brands: ['Titleist', 'Callaway', 'TaylorMade', 'Ping']
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Essential golf accessories and equipment',
    image: 'https://king-covy-assets.s3.amazonaws.com/categories/accessories.svg',
    count: '45 products',
    brands: ['Various']
  },
  {
    name: 'Collectibles',
    slug: 'collectibles',
    description: 'Rare and vintage golf equipment for collectors',
    image: 'https://king-covy-assets.s3.amazonaws.com/categories/collectibles.svg',
    count: '28 products',
    brands: ['Various Vintage']
  }
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Shop by Category
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Browse our carefully curated collection of premium golf equipment
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Categories</h2>
            <p className="text-lg text-gray-600">
              Find the perfect equipment for your game
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop?category=${category.slug}`}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-primary-300"
              >
                {/* Category Image */}
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-primary-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </div>

                {/* Category Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Popular Brands:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.brands.slice(0, 3).map((brand, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {brand}
                        </span>
                      ))}
                      {category.brands.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{category.brands.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700">
                    Shop {category.name}
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Brands</h2>
            <p className="text-lg text-gray-600">
              We carry equipment from the most trusted names in golf
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
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
            ].map((brand) => (
              <div key={brand.name} className="text-center group">
                <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Image
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      width={64}
                      height={64}
                      className="object-contain group-hover:scale-110 transition-transform duration-200"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {brand.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Our team of experts can help you find the perfect equipment or source rare items for your collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
