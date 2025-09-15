'use client';

import React, { useState, useEffect } from 'react';
import { Search, Upload, Grid, List, Filter, Download, Trash2, Eye } from 'lucide-react';
import ImageUploader from '@/components/common/ImageUploader';
import OptimizedImage from '@/components/common/OptimizedImage';

interface ImageAsset {
  id: string;
  key: string;
  url: string;
  filename: string;
  size: number;
  width?: number;
  height?: number;
  format: string;
  category: string;
  subfolder?: string;
  uploadedAt: string;
  tags?: string[];
}

interface ImageManagerProps {
  category?: 'products' | 'brands' | 'categories' | 'temp';
  onImageSelect?: (image: ImageAsset) => void;
  selectionMode?: boolean;
  className?: string;
}

const ImageManager: React.FC<ImageManagerProps> = ({
  category,
  onImageSelect,
  selectionMode = false,
  className = ''
}) => {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [showUploader, setShowUploader] = useState(false);

  // Mock data - replace with actual API calls
  const mockImages: ImageAsset[] = [
    {
      id: '1',
      key: 'products/drivers/scotty-cameron-newport-2.jpg',
      url: 'https://d1xso6am1gh0.cloudfront.net/products/drivers/scotty-cameron-newport-2.jpg',
      filename: 'scotty-cameron-newport-2.jpg',
      size: 1024000,
      width: 800,
      height: 600,
      format: 'jpg',
      category: 'products',
      subfolder: 'drivers',
      uploadedAt: '2024-01-15T10:30:00Z',
      tags: ['putter', 'scotty-cameron', 'newport']
    },
    {
      id: '2',
      key: 'brands/titleist-logo.png',
      url: 'https://d1xso6am1gh0.cloudfront.net/brands/titleist-logo.png',
      filename: 'titleist-logo.png',
      size: 512000,
      width: 400,
      height: 400,
      format: 'png',
      category: 'brands',
      uploadedAt: '2024-01-14T15:20:00Z',
      tags: ['logo', 'titleist', 'brand']
    }
  ];

  useEffect(() => {
    loadImages();
  }, [selectedCategory]);

  const loadImages = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      setImages(mockImages);
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter(image => {
    const matchesSearch = image.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         image.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleImageUpload = (urls: string[]) => {
    console.log('Images uploaded:', urls);
    // Reload images after upload
    loadImages();
    setShowUploader(false);
  };

  const handleDeleteImages = async () => {
    if (selectedImages.length === 0) return;
    
    const confirmed = confirm(`Delete ${selectedImages.length} image(s)?`);
    if (!confirmed) return;

    try {
      // Delete images from S3
      for (const imageId of selectedImages) {
        const image = images.find(img => img.id === imageId);
        if (image) {
          await fetch('/api/images/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: image.key })
          });
        }
      }
      
      setSelectedImages([]);
      loadImages();
    } catch (error) {
      console.error('Failed to delete images:', error);
      alert('Failed to delete images');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Image Manager</h2>
          <p className="text-gray-600">Manage and organize your image assets</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUploader(!showUploader)}
            className="btn-primary flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Images
          </button>
        </div>
      </div>

      {/* Uploader */}
      {showUploader && (
        <div className="bg-white p-6 rounded-lg border">
          <ImageUploader
            category={selectedCategory as any || 'temp'}
            maxFiles={10}
            onUploadComplete={handleImageUpload}
            onUploadError={(error) => alert(error)}
          />
        </div>
      )}

      {/* Filters and Controls */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 input-field"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field w-auto"
          >
            <option value="all">All Categories</option>
            <option value="products">Products</option>
            <option value="brands">Brands</option>
            <option value="categories">Categories</option>
            <option value="temp">Temporary</option>
          </select>

          {/* View Mode */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary-600 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Bulk Actions */}
          {selectedImages.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedImages.length} selected
              </span>
              <button
                onClick={handleDeleteImages}
                className="btn-danger flex items-center gap-1 text-sm"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Images Grid/List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Loading images...</span>
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Eye className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
          <p className="text-gray-600">Upload some images to get started</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className={`relative group bg-white rounded-lg border-2 transition-all cursor-pointer ${
                selectedImages.includes(image.id)
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                if (selectionMode) {
                  onImageSelect?.(image);
                } else {
                  setSelectedImages(prev =>
                    prev.includes(image.id)
                      ? prev.filter(id => id !== image.id)
                      : [...prev, image.id]
                  );
                }
              }}
            >
              <div className="aspect-square p-2">
                <OptimizedImage
                  src={image.url}
                  alt={image.filename}
                  fill
                  className="rounded"
                />
              </div>
              
              <div className="p-3">
                <div className="text-xs font-medium text-gray-900 truncate mb-1">
                  {image.filename}
                </div>
                <div className="text-xs text-gray-500">
                  {formatFileSize(image.size)}
                </div>
                {image.width && image.height && (
                  <div className="text-xs text-gray-500">
                    {image.width} × {image.height}
                  </div>
                )}
              </div>

              {/* Selection indicator */}
              {selectedImages.includes(image.id) && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Filename
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dimensions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredImages.map((image) => (
                  <tr
                    key={image.id}
                    className={`cursor-pointer transition-colors ${
                      selectedImages.includes(image.id)
                        ? 'bg-primary-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      if (selectionMode) {
                        onImageSelect?.(image);
                      } else {
                        setSelectedImages(prev =>
                          prev.includes(image.id)
                            ? prev.filter(id => id !== image.id)
                            : [...prev, image.id]
                        );
                      }
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 relative">
                        <OptimizedImage
                          src={image.url}
                          alt={image.filename}
                          fill
                          className="rounded"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {image.filename}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {image.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(image.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {image.width && image.height ? `${image.width} × ${image.height}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(image.uploadedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManager;
