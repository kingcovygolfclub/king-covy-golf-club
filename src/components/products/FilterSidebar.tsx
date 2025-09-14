'use client';

import React from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Product, FilterOptions } from '@/types';

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  products: Product[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  products,
}) => {
  // Extract unique values for filter options
  const categories = Array.from(new Set(products.map(p => p.category)));
  const brands = Array.from(new Set(products.map(p => p.brand)));
  const conditions = Array.from(new Set(products.map(p => p.condition)));
  const prices = products.map(p => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = filters.category || [];
    const newCategories = checked
      ? [...currentCategories, category as any]
      : currentCategories.filter(c => c !== category);
    
    onFilterChange({
      ...filters,
      category: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const currentBrands = filters.brand || [];
    const newBrands = checked
      ? [...currentBrands, brand]
      : currentBrands.filter(b => b !== brand);
    
    onFilterChange({
      ...filters,
      brand: newBrands.length > 0 ? newBrands : undefined,
    });
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    const currentConditions = filters.condition || [];
    const newConditions = checked
      ? [...currentConditions, condition as any]
      : currentConditions.filter(c => c !== condition);
    
    onFilterChange({
      ...filters,
      condition: newConditions.length > 0 ? newConditions : undefined,
    });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    onFilterChange({
      ...filters,
      priceRange: { min, max },
    });
  };

  const handleInStockChange = (checked: boolean) => {
    onFilterChange({
      ...filters,
      inStock: checked || undefined,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Clear All
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Min: {formatPrice(filters.priceRange?.min || minPrice)}</span>
            <span className="text-sm text-gray-600">Max: {formatPrice(filters.priceRange?.max || maxPrice)}</span>
          </div>
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            step="10"
            value={filters.priceRange?.max || maxPrice}
            onChange={(e) => handlePriceRangeChange(minPrice, parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.category?.includes(category as any) || false}
                onChange={(e) => handleCategoryChange(category, e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">
                {category.replace('-', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Brands</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.brand?.includes(brand) || false}
                onChange={(e) => handleBrandChange(brand, e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Condition</h4>
        <div className="space-y-2">
          {conditions.map((condition) => (
            <label key={condition} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.condition?.includes(condition as any) || false}
                onChange={(e) => handleConditionChange(condition, e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">
                {condition.replace('-', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.inStock || false}
            onChange={(e) => handleInStockChange(e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
        </label>
      </div>
    </div>
  );
};

export default FilterSidebar;
