'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart, Filter, Grid, List } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

// Mock products data
const mockProducts = [
  {
    id: '1',
    name: 'Scotty Cameron Newport 2',
    description: 'Classic blade putter with milled face for consistent roll',
    price: 399.99,
    originalPrice: 449.99,
    images: ['/placeholder-golf-club.jpg'],
    category: 'putters' as const,
    brand: 'Scotty Cameron',
    condition: 'excellent' as const,
    stock: 3,
    isCustomizable: true,
    specifications: {
      model: 'Newport 2',
      year: 2023,
      weight: '350g',
      finish: 'Stainless Steel',
      length: '34 inches',
      loft: 3,
      lie: 70,
      grip: 'Scotty Cameron Matador',
      material: 'Stainless Steel'
    },
    customizationOptions: {
      engraving: {
        available: true,
        maxLength: 20,
        locations: ['toe', 'heel', 'bumper']
      },
      grip: {
        available: true,
        options: [
          { id: 'standard', name: 'Standard Matador', price: 0, colors: ['black', 'red'] },
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
    tags: ['putter', 'scotty-cameron', 'blade', 'milled', 'premium']
  },
  {
    id: '2',
    name: 'Titleist TSR3 Driver',
    description: 'Advanced driver with adjustable CG for maximum distance',
    price: 599.99,
    images: ['/placeholder-golf-club.jpg'],
    category: 'drivers' as const,
    brand: 'Titleist',
    condition: 'new' as const,
    stock: 5,
    isCustomizable: true,
    specifications: {
      model: 'TSR3',
      year: 2023,
      weight: '308g',
      finish: 'Pearl',
      length: '45.5 inches',
      loft: 9.5,
      lie: 58,
      grip: 'Golf Pride Tour Velvet',
      material: 'Titanium'
    },
    customizationOptions: {
      engraving: {
        available: true,
        maxLength: 15,
        locations: ['crown', 'sole']
      },
      grip: {
        available: true,
        options: [
          { id: 'standard', name: 'Tour Velvet', price: 0, colors: ['black', 'blue'] },
          { id: 'premium', name: 'Winn Dri-Tac', price: 20, colors: ['white', 'gray'] }
        ]
      },
      shaft: {
        available: true,
        options: [
          { id: 'standard', name: 'HZRDUS Smoke', price: 0, flex: 'stiff', weight: '60g' },
          { id: 'premium', name: 'Aldila Rogue', price: 100, flex: 'x-stiff', weight: '65g' }
        ]
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    featured: true,
    tags: ['driver', 'titleist', 'tsr3', 'adjustable', 'distance']
  },
  {
    id: '3',
    name: 'Mizuno MP-20 Irons',
    description: 'Forged muscle back irons for skilled players',
    price: 1299.99,
    images: ['/placeholder-golf-club.jpg'],
    category: 'irons' as const,
    brand: 'Mizuno',
    condition: 'like-new' as const,
    stock: 2,
    isCustomizable: true,
    specifications: {
      model: 'MP-20',
      year: 2020,
      weight: '425g (6-iron)',
      finish: 'Chrome',
      length: '37.5 inches (6-iron)',
      loft: 30,
      lie: 62,
      grip: 'Golf Pride Tour Velvet',
      material: 'Forged Carbon Steel'
    },
    customizationOptions: {
      engraving: {
        available: true,
        maxLength: 10,
        locations: ['hosel', 'back']
      },
      grip: {
        available: true,
        options: [
          { id: 'standard', name: 'Tour Velvet', price: 0, colors: ['black', 'white'] },
          { id: 'premium', name: 'Golf Pride MCC', price: 15, colors: ['black', 'gray'] }
        ]
      },
      shaft: {
        available: true,
        options: [
          { id: 'standard', name: 'KBS Tour', price: 0, flex: 'stiff', weight: '120g' },
          { id: 'premium', name: 'True Temper Dynamic Gold', price: 80, flex: 'x-stiff', weight: '130g' }
        ]
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    featured: true,
    tags: ['irons', 'mizuno', 'mp-20', 'forged', 'muscle-back']
  }
];

export default function ShopPage() {
  const [products] = useState<Product[]>(mockProducts);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { addItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleAddToCart = (product: Product) => {
    console.log('Adding to cart:', product);
    console.log('Cart context:', { addItem });
    try {
      addItem(product, 1);
      // Show success message
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart. Please try again.');
    }
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="card group">
      <div className="relative aspect-square overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-600 rounded-full mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-lg font-bold">G</span>
            </div>
            <p className="text-gray-600 text-sm">Golf Club</p>
          </div>
        </div>
        {product.originalPrice && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            Sale
          </div>
        )}
        {product.isCustomizable && (
          <div className="absolute bottom-4 left-4 bg-primary-600 text-white px-2 py-1 rounded text-xs font-semibold">
            Customizable
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{product.brand}</span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">4.9</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
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
            className="flex-1 text-center btn-secondary text-sm"
          >
            View Details
          </Link>
          <button 
            onClick={(e) => {
              e.preventDefault();
              console.log('Button clicked for product:', product.name);
              handleAddToCart(product);
            }}
            disabled={product.stock === 0}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop Golf Equipment</h1>
          <p className="text-gray-600">
            Discover premium boutique and collector's golf clubs, putters, and accessories
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {products.length} products found
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <select className="input-field w-auto">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="newest">Newest First</option>
            </select>
            
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}