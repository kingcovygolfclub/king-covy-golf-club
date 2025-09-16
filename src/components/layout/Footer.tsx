import React from 'react';
import Link from 'next/link';
import NoPrefetchLink from '@/components/ui/NoPrefetchLink';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Logo from '@/components/ui/Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Logo size="lg" showText={true} className="text-white" />
            <p className="text-gray-300 text-sm">
              Premium boutique and collector's golf clubs, putters, accessories, 
              and golf-related merchandise with customizations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-magenta-400 transition-all duration-300 hover:scale-110">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <NoPrefetchLink href="/shop" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
                  Shop All Products
                </NoPrefetchLink>
              </li>
              <li>
                <NoPrefetchLink href="/categories" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
                  Categories
                </NoPrefetchLink>
              </li>
              <li>
                <NoPrefetchLink href="/custom" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
                  Custom Orders
                </NoPrefetchLink>
              </li>
              <li>
                <NoPrefetchLink href="/about" className="text-gray-300 hover:text-cyan-400 transition-colors duration-300">
                  About Us
                </NoPrefetchLink>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <NoPrefetchLink href="/shipping" className="text-gray-300 hover:text-white transition-colors">
                  Shipping Info
                </NoPrefetchLink>
              </li>
              <li>
                <NoPrefetchLink href="/returns" className="text-gray-300 hover:text-white transition-colors">
                  Returns & Exchanges
                </NoPrefetchLink>
              </li>
              <li>
                <NoPrefetchLink href="/warranty" className="text-gray-300 hover:text-white transition-colors">
                  Warranty
                </NoPrefetchLink>
              </li>
              <li>
                <NoPrefetchLink href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </NoPrefetchLink>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">info@kingcovygolfclub.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">
                  Your Business Address<br />
                  Your City, State ZIP
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} King Covy Golf Club. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <NoPrefetchLink href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </NoPrefetchLink>
              <NoPrefetchLink href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </NoPrefetchLink>
              <NoPrefetchLink href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </NoPrefetchLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
