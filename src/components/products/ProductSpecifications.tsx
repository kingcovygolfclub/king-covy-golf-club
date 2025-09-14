import React from 'react';
import { ProductSpecifications as ProductSpecs } from '@/types';

interface ProductSpecificationsProps {
  specifications: ProductSpecs;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ specifications }) => {
  const specItems = [
    { label: 'Model', value: specifications.model },
    { label: 'Year', value: specifications.year?.toString() },
    { label: 'Loft', value: specifications.loft ? `${specifications.loft}°` : undefined },
    { label: 'Lie', value: specifications.lie ? `${specifications.lie}°` : undefined },
    { label: 'Weight', value: specifications.weight },
    { label: 'Length', value: specifications.length },
    { label: 'Shaft', value: specifications.shaft },
    { label: 'Grip', value: specifications.grip },
    { label: 'Flex', value: specifications.flex },
    { label: 'Material', value: specifications.material },
    { label: 'Finish', value: specifications.finish },
  ].filter(item => item.value);

  if (specItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Specifications</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specItems.map((item, index) => (
          <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
            <span className="text-gray-600 font-medium">{item.label}:</span>
            <span className="text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSpecifications;
