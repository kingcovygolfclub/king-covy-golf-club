'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ShoppingCart, Truck, Shield, RotateCcw, ArrowLeft, Heart, Share2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { apiService } from '@/services/api';
import { Product } from '@/types';
import { AnimatedSection, AnimatedText, AnimatedButton } from '@/components/ui/AnimatedSection';

// Mock product data
const mockProduct = {
  id: '1',
  name: 'Scotty Cameron Newport 2',
  description: 'The Scotty Cameron Newport 2 is a classic blade putter that has been trusted by professionals for decades. This premium putter features a milled face for consistent roll and exceptional feel. The Newport 2\'s timeless design and superior craftsmanship make it a favorite among golfers who demand the best.',
  price: 399.99,
  originalPrice: 449.99,
  images: [
    'https://king-covy-assets.s3.amazonaws.com/products/drivers/generic-driver.jpg',
    'https://king-covy-assets.s3.amazonaws.com/products/drivers/generic-driver.jpg',
    'https://king-covy-assets.s3.amazonaws.com/products/drivers/generic-driver.jpg',
    'https://king-covy-assets.s3.amazonaws.com/products/drivers/generic-driver.jpg'
  ],
  category: 'putters' as const,
  brand: 'Scotty Cameron',
  condition: 'excellent' as const,
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
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedGrip, setSelectedGrip] = useState('standard');
  const [engravingText, setEngravingText] = useState('');
  const [engravingLocation, setEngravingLocation] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCart();

  // Load product from API
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getProduct(params.id);
        
        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          console.warn('API failed, using mock data:', response.error);
          setProduct(mockProduct as Product);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
        setError('Failed to load product');
        setProduct(mockProduct as Product);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    
    let basePrice = product.price;
    let customizationPrice = 0;

    if (selectedGrip !== 'standard' && product.customizationOptions?.grip?.options) {
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
    if (!product) return;
    
    const customizations = {
      grip: selectedGrip,
      engraving: engravingText ? `${engravingText} (${engravingLocation})` : undefined
    };
    
    addItem(product, quantity, customizations);
    
    // Show success message (you could use a toast library here)
    alert(`${product.name} added to cart!`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <AnimatedSection variant="fadeInUp" className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600">Loading premium product...</p>
        </AnimatedSection>
      </div>
    );
  }

  // Error state
  if (error && !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <AnimatedSection variant="fadeInUp" className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md">
            <h3 className="text-xl font-semibold text-red-800 mb-4">Error loading product</h3>
            <p className="text-red-700 mb-6">{error}</p>
            <AnimatedButton href="/shop" variant="primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </AnimatedButton>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <AnimatedSection variant="fadeInUp" className="text-center">
          <div className="max-w-md">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Product not found</h3>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <AnimatedButton href="/shop" variant="primary">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </AnimatedButton>
          </div>
        </AnimatedSection>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <AnimatedSection variant="fadeInUp" className="mb-8">
          <nav className="bg-white rounded-2xl shadow-lg p-4">
            <ol className="flex items-center space-x-2 text-sm">
              <li><Link href="/" className="text-emerald-600 hover:text-emerald-700 font-medium">Home</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href="/shop" className="text-emerald-600 hover:text-emerald-700 font-medium">Shop</Link></li>
              <li className="text-gray-400">/</li>
              <li><Link href={`/shop?category=${product.category}`} className="text-emerald-600 hover:text-emerald-700 font-medium capitalize">
                {product.category.replace('-', ' ')}
              </Link></li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium">{product.name}</li>
            </ol>
          </nav>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <AnimatedSection variant="fadeInLeft">
            <div className="space-y-6">
              {/* Main Image */}
              <div className="aspect-square relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                      <span className="text-white text-4xl font-bold">K</span>
                    </div>
                    <p className="text-gray-600 font-medium text-lg">Premium Product</p>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 ${
                      isWishlisted 
                        ? 'bg-red-500 text-white shadow-lg' 
                        : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-3 rounded-full bg-white/80 text-gray-600 hover:bg-white hover:text-emerald-600 transition-all duration-300 backdrop-blur-sm">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                      selectedImageIndex === index
                        ? 'border-emerald-500 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-emerald-300 hover:shadow-md'
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">G</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Product Info */}
          <AnimatedSection variant="fadeInRight">
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-semibold">{product.brand}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1 font-medium">4.9 (24 reviews)</span>
                    </div>
                  </div>
                  {product.featured && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </span>
                  )}
                </div>
                
                <AnimatedText 
                  text={product.name}
                  className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6"
                />
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Save {formatPrice(product.originalPrice - product.price)}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-6 mb-8">
                  <span className="text-sm text-gray-600">
                    Condition: <span className="font-semibold text-emerald-600 capitalize">{product.condition}</span>
                  </span>
                  <span className="text-sm text-gray-600">
                    Stock: <span className="font-semibold text-blue-600">{product.stock} available</span>
                  </span>
                </div>
              </div>

              <div>
                <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
              </div>

              {/* Customization Options */}
              {product.isCustomizable && product.customizationOptions && (
                <AnimatedSection variant="fadeInUp" delay={0.2}>
                  <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8 border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                      <span className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">⚙️</span>
                      </span>
                      Customization Options
                    </h3>

                    {/* Engraving Options */}
                    {product.customizationOptions.engraving?.available && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Personal Engraving</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Engraving Text (Max {product.customizationOptions.engraving.maxLength} characters)
                            </label>
                            <input
                              type="text"
                              value={engravingText}
                              onChange={(e) => setEngravingText(e.target.value)}
                              maxLength={product.customizationOptions.engraving.maxLength}
                              placeholder="Enter text to engrave"
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                              {engravingText.length}/{product.customizationOptions.engraving.maxLength} characters
                            </p>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Engraving Location
                            </label>
                            <select
                              value={engravingLocation}
                              onChange={(e) => setEngravingLocation(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-900">Grip Selection</h4>
                        <div className="space-y-3">
                          {product.customizationOptions.grip.options.map((grip) => (
                            <label key={grip.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-300 hover:shadow-md">
                              <input
                                type="radio"
                                name="grip"
                                value={grip.id}
                                checked={selectedGrip === grip.id}
                                onChange={(e) => setSelectedGrip(e.target.value)}
                                className="text-emerald-600 focus:ring-emerald-500"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-gray-900">{grip.name}</span>
                                  <span className="text-sm font-medium text-gray-600">
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
                </AnimatedSection>
              )}

              {/* Quantity and Add to Cart */}
              <AnimatedSection variant="fadeInUp" delay={0.4}>
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="flex items-center space-x-4 mb-8">
                    <label className="text-lg font-semibold text-gray-700">Quantity:</label>
                    <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-6 py-3 border-x border-gray-300 font-semibold">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between text-2xl font-bold">
                      <span>Total:</span>
                      <span className="text-emerald-600">{formatPrice(calculateTotalPrice())}</span>
                    </div>
                    
                    <div className="flex space-x-4">
                      <AnimatedButton
                        onClick={handleAddToCart}
                        variant="primary"
                        size="lg"
                        className="flex-1"
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Add to Cart
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              {/* Features */}
              <AnimatedSection variant="fadeInUp" delay={0.6}>
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <Truck className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">Free Shipping</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">Authenticity Guaranteed</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                        <RotateCcw className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">30-Day Returns</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}