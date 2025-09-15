# Image Management System

## Overview

King Covy Golf Club uses a comprehensive image management system built on AWS S3 and CloudFront CDN, following industry best practices for storage, optimization, and delivery.

## Architecture

### Storage
- **Primary Storage**: AWS S3 bucket (`king-covy-assets`)
- **CDN**: CloudFront distribution for global delivery
- **Domain**: `https://d1xso6am1gh0.cloudfront.net`

### File Structure
```
king-covy-assets/
├── brands/                    # Brand logos and assets
│   ├── titleist-logo.svg
│   ├── callaway-logo.svg
│   └── ...
├── categories/                # Category images
│   ├── drivers.svg
│   ├── irons.svg
│   └── ...
├── products/                  # Product images
│   ├── drivers/              # Driver product images
│   ├── irons/                # Iron product images
│   ├── putters/              # Putter product images
│   ├── wedges/               # Wedge product images
│   ├── fairway-woods/        # Fairway wood images
│   ├── hybrids/              # Hybrid images
│   ├── thumbnails/           # Auto-generated thumbnails
│   └── placeholder-golf-club.svg
└── temp/                     # Temporary uploads
```

## Components

### 1. ImageService (`src/services/imageService.ts`)
Core service for image operations:
- Upload images to S3 with organized structure
- Generate optimized URLs with size parameters
- Create thumbnails automatically
- Delete images and cleanup thumbnails
- Validate file types and sizes

### 2. OptimizedImage (`src/components/common/OptimizedImage.tsx`)
React component for optimized image display:
- Automatic CDN URL generation
- Lazy loading and error handling
- Blur placeholders during load
- Responsive image sizing
- Fallback for failed loads

### 3. ImageUploader (`src/components/common/ImageUploader.tsx`)
Drag-and-drop upload interface:
- Multiple file selection
- Progress tracking
- File validation
- Preview generation
- Error handling

### 4. ImageManager (`src/components/admin/ImageManager.tsx`)
Admin interface for bulk image management:
- Grid and list view modes
- Search and filtering
- Bulk operations (delete, organize)
- Category organization
- Upload management

## Usage Examples

### Basic Image Upload
```typescript
import { imageService } from '@/services/imageService';

const uploadImage = async (file: File) => {
  const result = await imageService.uploadImage(
    file,
    'products',
    { 
      subfolder: 'drivers',
      generateThumbnails: true,
      optimize: true
    }
  );
  
  if (result.success) {
    console.log('Image URL:', result.url);
  }
};
```

### Display Optimized Image
```tsx
import OptimizedImage from '@/components/common/OptimizedImage';

<OptimizedImage
  src="https://d1xso6am1gh0.cloudfront.net/products/drivers/titleist-tsr3-driver.svg"
  alt="Titleist TSR3 Driver"
  width={400}
  height={300}
  className="rounded-lg"
/>
```

### Upload Interface
```tsx
import ImageUploader from '@/components/common/ImageUploader';

<ImageUploader
  category="products"
  subfolder="drivers"
  maxFiles={5}
  onUploadComplete={(urls) => console.log('Uploaded:', urls)}
  onUploadError={(error) => console.error(error)}
/>
```

## Image Specifications

### Supported Formats
- **Web Formats**: JPEG, PNG, WebP, AVIF
- **Vector**: SVG (recommended for logos and icons)
- **Max File Size**: 10MB
- **Recommended Dimensions**: 
  - Product images: 800x600px minimum
  - Brand logos: 400x400px
  - Thumbnails: Auto-generated (150px, 300px, 600px)

### Optimization Features
- **Automatic Thumbnails**: Generated in multiple sizes
- **CDN Caching**: 1-year cache headers
- **Format Conversion**: WebP/AVIF for better compression
- **Lazy Loading**: Images load as needed
- **Responsive Images**: Multiple sizes for different devices

## Admin Features

### Image Management Dashboard
Access via `/admin/images`:
- View all uploaded images
- Search and filter by category
- Bulk operations (delete, organize)
- Upload new images
- Manage existing assets

### Categories
- **Products**: Golf equipment images
- **Brands**: Company logos and brand assets
- **Categories**: Category-specific imagery
- **Temp**: Temporary uploads for review

## Best Practices

### File Naming
- Use descriptive, SEO-friendly names
- Include brand/model information
- Use lowercase with hyphens
- Example: `scotty-cameron-newport-2-putter.svg`

### Image Optimization
- Use SVG for logos and simple graphics
- Use WebP/AVIF for photos when possible
- Optimize file sizes before upload
- Use appropriate dimensions for display

### Organization
- Group related images in subfolders
- Use consistent naming conventions
- Add descriptive tags when uploading
- Regular cleanup of unused images

## API Endpoints

### Upload Image
```
POST /api/images/upload
Content-Type: multipart/form-data

Body:
- file: Image file
- category: 'products' | 'brands' | 'categories' | 'temp'
- subfolder: Optional subfolder name
- generateThumbnails: boolean
```

### Delete Image
```
DELETE /api/images/delete
Content-Type: application/json

Body:
{
  "key": "products/drivers/image-name.jpg"
}
```

### Get Images
```
GET /api/images?category=products&limit=50
```

## Monitoring and Analytics

### CloudWatch Metrics
- Upload success/failure rates
- CDN hit/miss ratios
- Storage usage by category
- Error rates and patterns

### Performance Monitoring
- Image load times
- CDN delivery speeds
- Error tracking
- User experience metrics

## Security

### Access Control
- S3 bucket policies for secure access
- CloudFront signed URLs for private content
- Admin authentication for management
- File type validation

### Content Security
- Automatic virus scanning (if configured)
- File size limits
- Format validation
- Secure upload endpoints

## Maintenance

### Regular Tasks
- Monitor storage usage
- Clean up unused images
- Update CDN cache policies
- Review and optimize images
- Backup critical assets

### Scaling Considerations
- S3 lifecycle policies for old images
- CDN cache optimization
- Image processing queue management
- Storage cost monitoring

## Troubleshooting

### Common Issues
1. **Upload Failures**: Check file size and format
2. **CDN Issues**: Verify CloudFront configuration
3. **Slow Loading**: Check image optimization
4. **Missing Images**: Verify S3 permissions

### Debug Tools
- Browser developer tools for network issues
- AWS CloudWatch for server-side monitoring
- CDN analytics for delivery performance
- S3 access logs for upload tracking
