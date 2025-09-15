'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartDropdownProps {
  onClose: () => void;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ onClose }) => {
  const { items, total, removeItem, updateQuantity } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="p-6 text-center">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link
            href="/shop"
            className="btn-primary"
            onClick={onClose}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Shopping Cart</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.productId} className="p-4 border-b border-gray-100">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <Image
                  src={item.product.images[0] || '/placeholder-golf-club.svg'}
                  alt={item.product.name}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {item.product.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {item.product.brand} • {item.product.condition}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-lg font-semibold">{formatPrice(total)}</span>
        </div>
        <div className="space-y-2">
          <Link
            href="/cart"
            className="block w-full text-center btn-secondary"
            onClick={onClose}
          >
            View Cart
          </Link>
          <Link
            href="/checkout"
            className="block w-full text-center btn-primary"
            onClick={onClose}
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartDropdown;
