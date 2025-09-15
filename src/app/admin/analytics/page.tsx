'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users,
  Package
} from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-600 mt-2">View detailed business analytics and reports</p>
            </div>
            <Link 
              href="/admin" 
              className="btn-secondary"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <BarChart3 className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Coming Soon</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We're working on comprehensive analytics and reporting features. This will include sales trends, 
            customer insights, product performance, and revenue analytics.
          </p>
          
          {/* Preview of planned features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sales Trends</h3>
              <p className="text-sm text-gray-600">Track revenue and sales patterns over time</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Customer Insights</h3>
              <p className="text-sm text-gray-600">Understand customer behavior and preferences</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Product Performance</h3>
              <p className="text-sm text-gray-600">Analyze which products are selling best</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
