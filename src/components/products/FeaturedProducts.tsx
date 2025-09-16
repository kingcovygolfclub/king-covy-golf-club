'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

// Mock data - replace with actual API call
const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Scotty Cameron Newport 2',
    description: 'Classic blade putter with milled face for consistent roll',
    price: 399.99,
    originalPrice: 449.99,
    images: ['https://king-covy-assets.s3.amazonaws.com/homepage/hero/hero.png'],
    category: 'putters',
    brand: 'Scotty Cameron',
    condition: 'excellent',
    specifications: {
      model: 'Newport 2',
      year: 2023,
      weight: '350g',
      finish: 'Stainless Steel',
      length: '34 inches'
    },
    stock: 3,
    isCustomizable: true,
    customizationOptions: {
      engraving: {
        available: true,
        maxLength: 20,
        locations: ['toe', 'heel']
      },
      grip: {
        available: true,
        options: [
          { id: 'standard', name: 'Standard Grip', price: 0, colors: ['black'] },
          { id: 'premium', name: 'Premium Leather', price: 25, colors: ['brown', 'black'] }
        ]
      },
      shaft: {
        available: false,
        options: []
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    featured: true,
    tags: ['putter', 'scotty-cameron', 'blade', 'milled']
  },
  {
    id: '2',
    name: 'Titleist TSR3 Driver',
    description: 'Advanced driver with adjustable CG for maximum distance',
    price: 599.99,
    images: ['https://king-covy-assets.s3.amazonaws.com/products/drivers/titleist-tsr3-driver.svg'],
    category: 'drivers',
    brand: 'Titleist',
    condition: 'new',
    specifications: {
      model: 'TSR3',
      year: 2023,
      loft: 9.5,
      shaft: 'HZRDUS Black 4G',
      flex: 'Stiff'
    },
    stock: 5,
    isCustomizable: true,
    customizationOptions: {
      engraving: {
        available: true,
        maxLength: 15,
        locations: ['crown']
      },
      grip: {
        available: true,
        options: [
          { id: 'standard', name: 'Standard Grip', price: 0, colors: ['black'] },
          { id: 'cord', name: 'Cord Grip', price: 15, colors: ['black', 'white'] }
        ]
      },
      shaft: {
        available: true,
        options: [
          { id: 'hzrdus', name: 'HZRDUS Black 4G', price: 0, flex: 'Stiff', weight: '60g' },
          { id: 'ventus', name: 'Fujikura Ventus', price: 150, flex: 'Stiff', weight: '65g' }
        ]
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    featured: true,
    tags: ['driver', 'titleist', 'adjustable', 'distance']
  },
  {
    id: '3',
    name: 'Mizuno MP-20 Irons',
    description: 'Forged muscle back irons for skilled players',
    price: 1299.99,
    images: ['https://king-covy-assets.s3.amazonaws.com/products/irons/mizuno-mp20-irons.svg'],
    category: 'irons',
    brand: 'Mizuno',
    condition: 'like-new',
    specifications: {
      model: 'MP-20',
      year: 2019,
      material: 'Forged Carbon Steel',
      finish: 'Chrome'
    },
    stock: 2,
    isCustomizable: true,
    customizationOptions: {
      engraving: {
        available: true,
        maxLength: 12,
        locations: ['hosel']
      },
      grip: {
        available: true,
        options: [
          { id: 'standard', name: 'Standard Grip', price: 0, colors: ['black'] },
          { id: 'mizuno', name: 'Mizuno Premium', price: 20, colors: ['black', 'blue'] }
        ]
      },
      shaft: {
        available: true,
        options: [
          { id: 'dynamic-gold', name: 'True Temper Dynamic Gold', price: 0, flex: 'Stiff', weight: '120g' },
          { id: 'kbs', name: 'KBS Tour', price: 100, flex: 'Stiff', weight: '120g' }
        ]
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    featured: true,
    tags: ['irons', 'mizuno', 'forged', 'muscle-back']
  }
];

const FeaturedProducts: React.FC = () => {
  const { addItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredProducts.map((product) => (
        <div key={product.id} className="card group">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.images[0] || 'https://king-covy-assets.s3.amazonaws.com/products/placeholder-golf-club.svg'}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.originalPrice && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                Sale
              </div>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-semibold">Out of Stock</span>
              </div>
            )}
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">{product.brand}</span>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">4.9</span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {product.name}
            </h3>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500 capitalize">
                {product.condition}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <Link
                href={`/products/${product.id}`}
                className="flex-1 text-center btn-secondary"
              >
                View Details
              </Link>
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturedProducts;
