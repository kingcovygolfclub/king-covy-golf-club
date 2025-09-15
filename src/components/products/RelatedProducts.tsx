'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ currentProductId, category }) => {
  const { addItem } = useCart();

  // Mock related products - replace with actual API call
  const relatedProducts: Product[] = [
    {
      id: '2',
      name: 'Scotty Cameron Newport 2.5',
      description: 'Slightly larger blade putter with enhanced stability',
      price: 429.99,
      images: ['https://king-covy-assets.s3.amazonaws.com/products/putters/scotty-cameron-newport-2.jpg'],
      category: 'putters' as const,
      brand: 'Scotty Cameron',
      condition: 'excellent' as const,
      specifications: {
        model: 'Newport 2.5',
        year: 2023,
        weight: '350g',
        finish: 'Stainless Steel',
        length: '34 inches'
      },
      stock: 2,
      isCustomizable: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      featured: false,
      tags: ['putter', 'scotty-cameron', 'blade', 'milled']
    },
    {
      id: '3',
      name: 'Scotty Cameron Phantom X 5',
      description: 'Modern mallet putter with advanced alignment features',
      price: 399.99,
      images: ['https://king-covy-assets.s3.amazonaws.com/products/putters/scotty-cameron-newport-2.jpg'],
      category: 'putters' as const,
      brand: 'Scotty Cameron',
      condition: 'like-new' as const,
      specifications: {
        model: 'Phantom X 5',
        year: 2023,
        weight: '360g',
        finish: 'Stainless Steel',
        length: '34 inches'
      },
      stock: 4,
      isCustomizable: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      featured: false,
      tags: ['putter', 'scotty-cameron', 'mallet', 'alignment']
    },
    {
      id: '4',
      name: 'Odyssey White Hot OG #7',
      description: 'Classic mallet putter with legendary White Hot insert',
      price: 249.99,
      images: ['https://king-covy-assets.s3.amazonaws.com/products/putters/scotty-cameron-newport-2.jpg'],
      category: 'putters' as const,
      brand: 'Odyssey',
      condition: 'very-good' as const,
      specifications: {
        model: 'White Hot OG #7',
        year: 2022,
        weight: '355g',
        finish: 'PVD',
        length: '34 inches'
      },
      stock: 6,
      isCustomizable: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      featured: false,
      tags: ['putter', 'odyssey', 'mallet', 'white-hot']
    }
  ].filter(product => product.id !== currentProductId).slice(0, 3);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Related Products</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedProducts.map((product) => (
          <div key={product.id} className="group">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
              <Image
                src={product.images[0] || 'https://king-covy-assets.s3.amazonaws.com/products/drivers/generic-driver.jpg'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{product.brand}</span>
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600 ml-1">4.9</span>
                </div>
              </div>
              
              <h4 className="font-medium text-gray-900 line-clamp-2">
                {product.name}
              </h4>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  {product.condition}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Link
                  href={`/products/${product.id}`}
                  className="flex-1 text-center btn-secondary text-sm"
                >
                  View
                </Link>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center"
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
