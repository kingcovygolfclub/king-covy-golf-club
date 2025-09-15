'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users,
  Package,
  Calendar,
  Percent,
  Warehouse,
  Receipt
} from 'lucide-react';

export default function AnalyticsPage() {
  const upcomingFeatures = [
    {
      icon: TrendingUp,
      title: 'Sales Trends',
      description: 'Track revenue and sales patterns over time with interactive charts and date range filters.',
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'Customer Insights',
      description: 'Understand customer behavior and preferences with purchase history and demographic analysis.',
      color: 'bg-green-500'
    },
    {
      icon: Package,
      title: 'Product Performance',
      description: 'Analyze which products are selling best by revenue, units sold, and profit margins.',
      color: 'bg-purple-500'
    },
    {
      icon: DollarSign,
      title: 'Profit Analysis',
      description: 'Deep dive into profit margins, cost analysis, and ROI tracking for your inventory.',
      color: 'bg-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Inventory Analytics',
      description: 'Monitor inventory turnover, aging reports, and stock optimization recommendations.',
      color: 'bg-orange-500'
    },
    {
      icon: Calendar,
      title: 'Seasonal Trends',
      description: 'Identify seasonal patterns and optimize inventory planning for peak demand periods.',
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-2">Comprehensive analytics and reporting features for your golf club inventory business</p>
            </div>
            <Link 
              href="/admin" 
              className="btn-secondary"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Coming Soon Message */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-8 mb-8">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Coming Soon</h2>
            <p className="text-gray-700 text-lg mb-6">
              We're working on comprehensive analytics and reporting features to help you make data-driven decisions about your inventory and sales.
            </p>
            <div className="bg-white rounded-lg p-4 inline-block shadow-sm">
              <p className="text-sm text-gray-600">
                <strong>Expected Launch:</strong> Q2 2024
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Features Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Planned Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg ${feature.color}`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 ml-3">{feature.title}</h4>
                </div>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current Metrics Preview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Metrics Available</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-lg font-semibold text-gray-900">Dashboard</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Receipt className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Items Sold</p>
              <p className="text-lg font-semibold text-gray-900">Dashboard</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Percent className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Profit Margin</p>
              <p className="text-lg font-semibold text-gray-900">Dashboard</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Warehouse className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Inventory Value</p>
              <p className="text-lg font-semibold text-gray-900">Dashboard</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center">
            View detailed metrics on the main dashboard. Advanced analytics coming soon!
          </p>
        </div>

        {/* Feedback Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Have Suggestions?</h3>
          <p className="text-gray-600 mb-4">
            We'd love to hear what analytics features would be most valuable for your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Request Feature
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              View Roadmap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}