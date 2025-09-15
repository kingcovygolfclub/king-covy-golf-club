/**
 * Image Service for King Covy Golf Club
 * Handles image uploads, optimization, and CDN delivery
 */

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  key?: string;
}

export interface ImageMetadata {
  key: string;
  url: string;
  size: number;
  width?: number;
  height?: number;
  format: string;
  uploadedAt: string;
}

class ImageService {
  private readonly BUCKET_NAME = 'king-covy-assets';
  private readonly CDN_DOMAIN = 'https://d1xso6am1gh0.cloudfront.net'; // Update with your CloudFront domain
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly ALLOWED_FORMATS = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

  /**
   * Upload image to S3 with organized folder structure
   */
  async uploadImage(
    file: File,
    category: 'products' | 'brands' | 'categories' | 'temp',
    options: {
      subfolder?: string;
      generateThumbnails?: boolean;
      optimize?: boolean;
    } = {}
  ): Promise<ImageUploadResult> {
    try {
      // Validate file
      if (!this.validateFile(file)) {
        return { success: false, error: 'Invalid file format or size' };
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filename = `${timestamp}_${randomId}.${extension}`;

      // Determine folder structure
      const folder = options.subfolder 
        ? `${category}/${options.subfolder}` 
        : category;
      const key = `${folder}/${filename}`;

      // Upload to S3
      const uploadResult = await this.uploadToS3(file, key);
      
      if (uploadResult.success) {
        const url = `${this.CDN_DOMAIN}/${key}`;
        
        // Generate thumbnails if requested
        if (options.generateThumbnails) {
          await this.generateThumbnails(key, file);
        }

        return {
          success: true,
          url,
          key
        };
      }

      return uploadResult;
    } catch (error) {
      console.error('Image upload error:', error);
      return { success: false, error: 'Upload failed' };
    }
  }

  /**
   * Upload multiple images in batch
   */
  async uploadMultipleImages(
    files: File[],
    category: 'products' | 'brands' | 'categories',
    subfolder?: string
  ): Promise<ImageUploadResult[]> {
    const uploadPromises = files.map(file => 
      this.uploadImage(file, category, { subfolder, generateThumbnails: true })
    );
    
    return Promise.all(uploadPromises);
  }

  /**
   * Get optimized image URL with size parameters
   */
  getOptimizedImageUrl(
    key: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'avif' | 'jpg' | 'png';
    } = {}
  ): string {
    const baseUrl = `${this.CDN_DOMAIN}/${key}`;
    
    if (!options.width && !options.height) {
      return baseUrl;
    }

    // For now, return base URL. In production, you'd use image optimization service
    // like AWS Lambda@Edge, Cloudinary, or similar
    return baseUrl;
  }

  /**
   * Get thumbnail URL
   */
  getThumbnailUrl(key: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
    const sizeMap = {
      small: 150,
      medium: 300,
      large: 600
    };

    const folder = key.split('/')[0];
    const filename = key.split('/').pop();
    const thumbnailKey = `${folder}/thumbnails/${size}_${filename}`;
    
    return `${this.CDN_DOMAIN}/${thumbnailKey}`;
  }

  /**
   * Delete image and its thumbnails
   */
  async deleteImage(key: string): Promise<boolean> {
    try {
      // Delete main image
      await this.deleteFromS3(key);
      
      // Delete thumbnails
      const folder = key.split('/')[0];
      const filename = key.split('/').pop();
      const thumbnailSizes = ['small', 'medium', 'large'];
      
      for (const size of thumbnailSizes) {
        const thumbnailKey = `${folder}/thumbnails/${size}_${filename}`;
        await this.deleteFromS3(thumbnailKey);
      }
      
      return true;
    } catch (error) {
      console.error('Delete image error:', error);
      return false;
    }
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File): boolean {
    if (!this.ALLOWED_FORMATS.includes(file.type)) {
      return false;
    }
    
    if (file.size > this.MAX_FILE_SIZE) {
      return false;
    }
    
    return true;
  }

  /**
   * Upload file to S3
   */
  private async uploadToS3(file: File, key: string): Promise<ImageUploadResult> {
    try {
      // This would use AWS SDK in a real implementation
      // For now, return a mock success response
      return {
        success: true,
        key
      };
    } catch (error) {
      return { success: false, error: 'S3 upload failed' };
    }
  }

  /**
   * Delete file from S3
   */
  private async deleteFromS3(key: string): Promise<void> {
    // This would use AWS SDK in a real implementation
    console.log(`Deleting ${key} from S3`);
  }

  /**
   * Generate thumbnails (would use Lambda or image processing service)
   */
  private async generateThumbnails(key: string, file: File): Promise<void> {
    // This would trigger a Lambda function or use an image processing service
    console.log(`Generating thumbnails for ${key}`);
  }
}

export const imageService = new ImageService();

// Image folder structure constants
export const IMAGE_FOLDERS = {
  PRODUCTS: 'products',
  BRANDS: 'brands', 
  CATEGORIES: 'categories',
  TEMP: 'temp'
} as const;

// Image size constants
export const IMAGE_SIZES = {
  THUMBNAIL_SMALL: 150,
  THUMBNAIL_MEDIUM: 300,
  THUMBNAIL_LARGE: 600,
  PRODUCT_CARD: 400,
  PRODUCT_DETAIL: 800,
  HERO: 1200
} as const;
