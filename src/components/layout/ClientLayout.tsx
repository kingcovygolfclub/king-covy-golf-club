'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { CartProvider } from '@/context/CartContext';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
