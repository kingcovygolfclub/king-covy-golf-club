'use client';

import React from 'react';
import Link from 'next/link';
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from 'lucide-react';

// Mock cart data
const mockCartItems = [
  {
    productId: '1',
    product: {
      id: '1',
      name: 'Scotty Cameron Newport 2',
      price: 399.99,
      images: ['/placeholder-golf-club.jpg'],
      brand: 'Scotty Cameron',
      condition: 'excellent'
    },
    quantity: 1,
    customizations: {
      engraving: 'JD 2024 (toe)',
      grip: 'premium'
    }
  }
];

export default function CartPage() {
  const items = mockCartItems;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 200 ? 0 : 15;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-lg text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/shop" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Cart Items</h2>
                  <button className="text-sm text-red-600 hover:text-red-700">
                    Clear Cart
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.productId} className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-md flex items-center justify-center">
                          <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-lg font-bold">G</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500">{item.product.brand}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          Condition: {item.product.condition}
                        </p>
                        
                        {item.customizations && (
                          <div className="mt-2 space-y-1">
                            {item.customizations.engraving && (
                              <p className="text-xs text-gray-600">
                                Engraving: {item.customizations.engraving}
                              </p>
                            )}
                            {item.customizations.grip && (
                              <p className="text-xs text-gray-600">
                                Grip: {item.customizations.grip}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button className="p-2 text-gray-600 hover:text-gray-900">
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-2 border-x border-gray-300">
                            {item.quantity}
                          </span>
                          <button className="p-2 text-gray-600 hover:text-gray-900">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatPrice(item.product.price)} each
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button className="p-2 text-gray-400 hover:text-red-600">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(calculateSubtotal())}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {calculateShipping() === 0 ? 'Free' : formatPrice(calculateShipping())}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">{formatPrice(calculateTax())}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link
                  href="/checkout"
                  className="w-full btn-primary text-center block"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/shop"
                  className="w-full btn-secondary text-center block"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-center space-y-2">
                  <p className="text-xs text-gray-500">Secure checkout with</p>
                  <div className="flex justify-center space-x-4">
                    <div className="text-xs text-gray-400">🔒 SSL</div>
                    <div className="text-xs text-gray-400">💳 Stripe</div>
                    <div className="text-xs text-gray-400">🚚 Free Shipping</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}