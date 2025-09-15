'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, Check } from 'lucide-react';
import { imageService, IMAGE_FOLDERS } from '@/services/imageService';

interface ImageUploaderProps {
  category: 'products' | 'brands' | 'categories' | 'temp';
  subfolder?: string;
  maxFiles?: number;
  onUploadComplete?: (urls: string[]) => void;
  onUploadError?: (error: string) => void;
  existingImages?: string[];
  onRemoveImage?: (url: string) => void;
  className?: string;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  category,
  subfolder,
  maxFiles = 5,
  onUploadComplete,
  onUploadError,
  existingImages = [],
  onRemoveImage,
  className = ''
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newFiles = fileArray.slice(0, maxFiles - existingImages.length - uploadingFiles.length);
    
    if (newFiles.length === 0) {
      onUploadError?.('Maximum number of files reached');
      return;
    }

    // Create uploading file objects
    const newUploadingFiles: UploadingFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Upload files
    for (const uploadingFile of newUploadingFiles) {
      try {
        const result = await imageService.uploadImage(
          uploadingFile.file,
          category,
          { subfolder, generateThumbnails: true }
        );

        setUploadingFiles(prev => 
          prev.map(f => 
            f.id === uploadingFile.id 
              ? { 
                  ...f, 
                  status: result.success ? 'success' : 'error',
                  url: result.url,
                  error: result.error,
                  progress: 100
                }
              : f
          )
        );

        if (result.success && result.url) {
          onUploadComplete?.([result.url]);
        } else {
          onUploadError?.(result.error || 'Upload failed');
        }
      } catch (error) {
        setUploadingFiles(prev => 
          prev.map(f => 
            f.id === uploadingFile.id 
              ? { ...f, status: 'error', error: 'Upload failed', progress: 100 }
              : f
          )
        );
        onUploadError?.('Upload failed');
      }
    }
  }, [category, subfolder, maxFiles, existingImages.length, uploadingFiles.length, onUploadComplete, onUploadError]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeUploadingFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  const removeExistingImage = (url: string) => {
    onRemoveImage?.(url);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${dragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-2">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-primary-600 hover:text-primary-500 cursor-pointer">
              Click to upload
            </span>{' '}
            or drag and drop
          </div>
          <div className="text-xs text-gray-500">
            PNG, JPG, WEBP up to 10MB
          </div>
        </div>
      </div>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Current Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {existingImages.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={url}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={() => removeExistingImage(url)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploading</h4>
          <div className="space-y-2">
            {uploadingFiles.map((file) => (
              <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {file.status === 'uploading' && (
                    <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  )}
                  {file.status === 'success' && (
                    <Check className="w-8 h-8 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {file.file.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(file.file.size)}
                  </div>
                  {file.status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div 
                        className="bg-primary-600 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                  {file.status === 'error' && file.error && (
                    <div className="text-xs text-red-600 mt-1">
                      {file.error}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => removeUploadingFile(file.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
