'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '@/context/CartContext';

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Scotty Cameron Newport 2',
  description: 'The Scotty Cameron Newport 2 is a classic blade putter that has been trusted by professionals for decades. This premium putter features a milled face for consistent roll and exceptional feel. The Newport 2\'s timeless design and superior craftsmanship make it a favorite among golfers who demand the best.',
  price: 399.99,
  originalPrice: 449.99,
  images: [
    '/placeholder-golf-club.jpg',
    '/placeholder-golf-club.jpg',
    '/placeholder-golf-club.jpg',
    '/placeholder-golf-club.jpg'
  ],
  category: 'putters',
  brand: 'Scotty Cameron',
  condition: 'excellent',
  specifications: {
    model: 'Newport 2',
    year: 2023,
    weight: '350g',
    finish: 'Stainless Steel',
    length: '34 inches',
    loft: '3°',
    lie: '70°',
    grip: 'Scotty Cameron Matador',
    material: 'Stainless Steel'
  },
  stock: 3,
  isCustomizable: true,
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
        { id: 'premium', name: 'Premium Leather', price: 25, colors: ['brown', 'black'] },
        { id: 'cord', name: 'Cord Grip', price: 15, colors: ['black', 'white'] }
      ]
    }
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  featured: true,
  tags: ['putter', 'scotty-cameron', 'blade', 'milled', 'premium']
};

export default function ProductDetailPage() {
  const [product] = useState(mockProduct);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedGrip, setSelectedGrip] = useState('standard');
  const [engravingText, setEngravingText] = useState('');
  const [engravingLocation, setEngravingLocation] = useState('');
  const { addItem } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const calculateTotalPrice = () => {
    let basePrice = product.price;
    let customizationPrice = 0;

    if (selectedGrip !== 'standard') {
      const gripOption = product.customizationOptions.grip.options.find(
        option => option.id === selectedGrip
      );
      if (gripOption) {
        customizationPrice += gripOption.price;
      }
    }

    return (basePrice + customizationPrice) * quantity;
  };

  const handleAddToCart = () => {
    const customizations = {
      grip: selectedGrip,
      engraving: {
        text: engravingText,
        location: engravingLocation
      }
    };
    
    addItem(product, quantity, customizations);
    
    // Show success message (you could use a toast library here)
    alert(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/shop" className="hover:text-primary-600">Shop</Link></li>
            <li>/</li>
            <li><Link href={`/shop?category=${product.category}`} className="hover:text-primary-600 capitalize">
              {product.category.replace('-', ' ')}
            </Link></li>
            <li>/</li>
            <li className="text-gray-900">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white text-3xl font-bold">K</span>
                    </div>
                    <p className="text-gray-600">Product Image</p>
                  </div>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-primary-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">G</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-gray-500">{product.brand}</span>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">4.9 (24 reviews)</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-sm text-gray-600 capitalize">
                  Condition: <span className="font-medium">{product.condition}</span>
                </span>
                <span className="text-sm text-gray-600">
                  Stock: <span className="font-medium">{product.stock} available</span>
                </span>
              </div>
            </div>

            <div>
              <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
            </div>

            {/* Customization Options */}
            {product.isCustomizable && product.customizationOptions && (
              <div className="bg-gray-50 rounded-lg p-6 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Customization Options</h3>

                {/* Engraving Options */}
                {product.customizationOptions.engraving?.available && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Personal Engraving</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Engraving Text (Max {product.customizationOptions.engraving.maxLength} characters)
                        </label>
                        <input
                          type="text"
                          value={engravingText}
                          onChange={(e) => setEngravingText(e.target.value)}
                          maxLength={product.customizationOptions.engraving.maxLength}
                          placeholder="Enter text to engrave"
                          className="input-field"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {engravingText.length}/{product.customizationOptions.engraving.maxLength} characters
                        </p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Engraving Location
                        </label>
                        <select
                          value={engravingLocation}
                          onChange={(e) => setEngravingLocation(e.target.value)}
                          className="input-field"
                        >
                          <option value="">Select location</option>
                          {product.customizationOptions.engraving.locations.map((location) => (
                            <option key={location} value={location} className="capitalize">
                              {location}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Grip Options */}
                {product.customizationOptions.grip?.available && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Grip Selection</h4>
                    <div className="space-y-3">
                      {product.customizationOptions.grip.options.map((grip) => (
                        <label key={grip.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name="grip"
                            value={grip.id}
                            checked={selectedGrip === grip.id}
                            onChange={(e) => setSelectedGrip(e.target.value)}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">{grip.name}</span>
                              <span className="text-sm text-gray-600">
                                {grip.price > 0 ? `+${formatPrice(grip.price)}` : 'Included'}
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-4 mb-6">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatPrice(calculateTotalPrice())}</span>
                </div>
                
                <div className="flex space-x-4">
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 btn-primary flex items-center justify-center"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-primary-600" />
                  <span className="text-sm text-gray-600">Free Shipping</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-primary-600" />
                  <span className="text-sm text-gray-600">Authenticity Guaranteed</span>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-5 w-5 text-primary-600" />
                  <span className="text-sm text-gray-600">30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}