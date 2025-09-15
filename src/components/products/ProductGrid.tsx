'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';
import Image from 'next/image';

interface ProductGridProps {
  products: Product[];
  viewMode: 'grid' | 'list';
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, viewMode }) => {
  const { addItem } = useCart();
  
  // console.log('ProductGrid rendered with viewMode:', viewMode, 'products:', products.length);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="card group relative">
      <button className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
        <Heart className="h-4 w-4 text-gray-400 hover:text-red-500" />
      </button>
      
      <div 
        className="relative w-full h-64 overflow-hidden group-hover:scale-105 transition-transform duration-300"
             style={{
               backgroundImage: `url(${product.images[0] || 'https://king-covy-assets.s3.amazonaws.com/products/drivers/generic-driver.jpg'})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundRepeat: 'no-repeat'
             }}
      >
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
            onClick={() => handleAddToCart(product)}
            disabled={product.stock === 0}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </button>
        </div>
      </div>
    </div>
  );

  const ProductListItem: React.FC<{ product: Product }> = ({ product }) => (
    <div className="card group">
      <div className="flex space-x-4 p-4">
        <div 
          className="relative w-24 h-24 flex-shrink-0 bg-cover bg-center bg-no-repeat rounded-md"
          style={{
            backgroundImage: `url(${product.images[0] || 'https://via.placeholder.com/400x300/4f46e5/ffffff?text=Golf+Club'}?v=${Date.now()}&force=${Math.random()})`
          }}
        >
          {product.originalPrice && (
            <div className="absolute -top-2 -left-2 bg-red-500 text-white px-1 py-0.5 rounded text-xs font-semibold">
              Sale
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm text-gray-500">{product.brand}</span>
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600 ml-1">4.9</span>
                </div>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">
                {product.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center space-x-4">
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
                {product.isCustomizable && (
                  <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded">
                    Customizable
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col space-y-2 ml-4">
              <Link
                href={`/products/${product.id}`}
                className="btn-secondary text-sm px-4 py-2"
              >
                View Details
              </Link>
              <button
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm px-4 py-2 flex items-center justify-center"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <ProductListItem key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
