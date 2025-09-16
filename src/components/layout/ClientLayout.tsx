'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import Header from './Header';
import Footer from './Footer';
import { CartProvider } from '@/context/CartContext';

// Dynamically import SiteLock to prevent SSR issues
const SiteLock = dynamic(() => import('@/components/auth/SiteLock'), {
  ssr: false,
  loading: () => null
});


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
        <SiteLock />
      </div>
    </CartProvider>
  );
}
