'use client';

import React from 'react';
import Image from 'next/image';

interface ProductImageGalleryProps {
  images: string[];
  selectedIndex: number;
  onImageSelect: (index: number) => void;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  selectedIndex,
  onImageSelect,
}) => {
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={images[selectedIndex] || 'https://king-covy-assets.s3.amazonaws.com/products/drivers/generic-driver.jpg'}
          alt={`Product image ${selectedIndex + 1}`}
          fill
          className="object-cover"
        />
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`aspect-square relative overflow-hidden rounded-lg border-2 transition-colors ${
                selectedIndex === index
                  ? 'border-primary-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={image || 'https://king-covy-assets.s3.amazonaws.com/products/drivers/generic-driver.jpg'}
                alt={`Product thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
