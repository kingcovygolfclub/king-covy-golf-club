'use client';

import React from 'react';
import { CustomizationOptions as CustomOptions } from '@/types';

interface CustomizationOptionsProps {
  options: CustomOptions;
  selectedGrip: string;
  onGripChange: (gripId: string) => void;
  engravingText: string;
  onEngravingTextChange: (text: string) => void;
  engravingLocation: string;
  onEngravingLocationChange: (location: string) => void;
}

const CustomizationOptions: React.FC<CustomizationOptionsProps> = ({
  options,
  selectedGrip,
  onGripChange,
  engravingText,
  onEngravingTextChange,
  engravingLocation,
  onEngravingLocationChange,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Customization Options</h3>

      {/* Engraving Options */}
      {options.engraving?.available && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Personal Engraving</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Engraving Text (Max {options.engraving.maxLength} characters)
              </label>
              <input
                type="text"
                value={engravingText}
                onChange={(e) => onEngravingTextChange(e.target.value)}
                maxLength={options.engraving.maxLength}
                placeholder="Enter text to engrave"
                className="input-field"
              />
              <p className="text-xs text-gray-500 mt-1">
                {engravingText.length}/{options.engraving.maxLength} characters
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Engraving Location
              </label>
              <select
                value={engravingLocation}
                onChange={(e) => onEngravingLocationChange(e.target.value)}
                className="input-field"
              >
                <option value="">Select location</option>
                {options.engraving.locations.map((location) => (
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
      {options.grip?.available && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Grip Selection</h4>
          <div className="space-y-3">
            {options.grip.options.map((grip) => (
              <label key={grip.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="grip"
                  value={grip.id}
                  checked={selectedGrip === grip.id}
                  onChange={(e) => onGripChange(e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{grip.name}</span>
                    <span className="text-sm text-gray-600">
                      {grip.price > 0 ? `+${formatPrice(grip.price)}` : 'Included'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">Available colors:</span>
                    <div className="flex space-x-1">
                      {grip.colors.map((color) => (
                        <div
                          key={color}
                          className={`w-4 h-4 rounded-full border border-gray-300 ${
                            color === 'black' ? 'bg-gray-900' :
                            color === 'white' ? 'bg-white' :
                            color === 'brown' ? 'bg-yellow-800' :
                            color === 'red' ? 'bg-red-500' : 'bg-gray-400'
                          }`}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Shaft Options */}
      {options.shaft?.available && options.shaft.options.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Shaft Selection</h4>
          <div className="space-y-3">
            {options.shaft.options.map((shaft) => (
              <label key={shaft.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="shaft"
                  value={shaft.id}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{shaft.name}</span>
                    <span className="text-sm text-gray-600">
                      {shaft.price > 0 ? `+${formatPrice(shaft.price)}` : 'Included'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {shaft.flex} • {shaft.weight}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizationOptions;
