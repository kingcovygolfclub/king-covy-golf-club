'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Settings, 
  Store, 
  Mail, 
  Shield, 
  CreditCard,
  Bell
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-2">Configure your store settings and preferences</p>
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
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Settings className="h-12 w-12 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings Coming Soon</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We're working on comprehensive settings management. This will include store configuration, 
            payment settings, notifications, and security preferences.
          </p>
          
          {/* Preview of planned features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Store className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Store Settings</h3>
              <p className="text-sm text-gray-600">Configure store information and branding</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Payment Settings</h3>
              <p className="text-sm text-gray-600">Configure payment methods and processing</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Settings</h3>
              <p className="text-sm text-gray-600">Configure email templates and notifications</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Security</h3>
              <p className="text-sm text-gray-600">Manage security settings and access controls</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <Bell className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Notifications</h3>
              <p className="text-sm text-gray-600">Configure alert and notification preferences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
