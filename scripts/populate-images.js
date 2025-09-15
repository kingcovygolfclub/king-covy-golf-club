/**
 * Script to populate S3 bucket with stock images and brand assets
 * Run with: node scripts/populate-images.js
 */

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS
AWS.config.update({ region: 'us-east-1' });
const s3 = new AWS.S3();

const BUCKET_NAME = 'king-covy-assets';
const CDN_DOMAIN = 'https://d1xso6am1gh0.cloudfront.net';

// Sample brand data
const brands = [
  { name: 'Titleist', slug: 'titleist' },
  { name: 'Callaway', slug: 'callaway' },
  { name: 'TaylorMade', slug: 'taylormade' },
  { name: 'Ping', slug: 'ping' },
  { name: 'Mizuno', slug: 'mizuno' },
  { name: 'Scotty Cameron', slug: 'scotty-cameron' },
  { name: 'Odyssey', slug: 'odyssey' },
  { name: 'Cleveland', slug: 'cleveland' },
  { name: 'Bettinardi', slug: 'bettinardi' },
  { name: 'Cobra', slug: 'cobra' },
  { name: 'Wilson', slug: 'wilson' },
  { name: 'Srixon', slug: 'srixon' }
];

// Sample product categories
const categories = [
  { name: 'Drivers', slug: 'drivers' },
  { name: 'Irons', slug: 'irons' },
  { name: 'Putters', slug: 'putters' },
  { name: 'Wedges', slug: 'wedges' },
  { name: 'Fairway Woods', slug: 'fairway-woods' },
  { name: 'Hybrids', slug: 'hybrids' },
  { name: 'Accessories', slug: 'accessories' },
  { name: 'Collectibles', slug: 'collectibles' }
];

// Sample product data with placeholder images
const products = [
  {
    id: 'scotty-cameron-newport-2',
    name: 'Scotty Cameron Newport 2',
    brand: 'Scotty Cameron',
    category: 'putters',
    price: 399.99,
    originalPrice: 449.99,
    description: 'Classic blade putter with milled face for consistent roll',
    specifications: {
      model: 'Newport 2',
      year: 2023,
      weight: '350g',
      finish: 'Stainless Steel',
      length: '34 inches',
      loft: 3,
      lie: 70,
      grip: 'Scotty Cameron Matador',
      material: 'Stainless Steel'
    },
    tags: ['putter', 'scotty-cameron', 'blade', 'milled', 'premium']
  },
  {
    id: 'titleist-tsr3-driver',
    name: 'Titleist TSR3 Driver',
    brand: 'Titleist',
    category: 'drivers',
    price: 599.99,
    description: 'Advanced driver with adjustable CG for maximum distance',
    specifications: {
      model: 'TSR3',
      year: 2023,
      weight: '308g',
      finish: 'Pearl',
      length: '45.5 inches',
      loft: 9.5,
      lie: 58,
      grip: 'Golf Pride Tour Velvet',
      material: 'Titanium'
    },
    tags: ['driver', 'titleist', 'tsr3', 'adjustable', 'distance']
  },
  {
    id: 'mizuno-mp20-irons',
    name: 'Mizuno MP-20 Irons',
    brand: 'Mizuno',
    category: 'irons',
    price: 1299.99,
    description: 'Forged muscle back irons for skilled players',
    specifications: {
      model: 'MP-20',
      year: 2020,
      weight: '425g (6-iron)',
      finish: 'Chrome',
      length: '37.5 inches (6-iron)',
      loft: 30,
      lie: 62,
      grip: 'Golf Pride Tour Velvet',
      material: 'Forged Carbon Steel'
    },
    tags: ['irons', 'mizuno', 'mp-20', 'forged', 'muscle-back']
  },
  {
    id: 'taylormade-stealth-2-fairway',
    name: 'TaylorMade Stealth 2 Fairway Wood',
    brand: 'TaylorMade',
    category: 'fairway-woods',
    price: 299.99,
    description: 'High-performance fairway wood with advanced aerodynamics',
    specifications: {
      model: 'Stealth 2',
      year: 2023,
      weight: '295g',
      finish: 'Carbon',
      length: '43 inches',
      loft: 15,
      lie: 58,
      grip: 'Golf Pride Tour Velvet',
      material: 'Carbon Fiber Crown'
    },
    tags: ['fairway-wood', 'taylormade', 'stealth', 'carbon', 'aerodynamics']
  },
  {
    id: 'ping-g425-hybrid',
    name: 'Ping G425 Hybrid',
    brand: 'Ping',
    category: 'hybrids',
    price: 249.99,
    description: 'Versatile hybrid for improved accuracy and distance',
    specifications: {
      model: 'G425',
      year: 2021,
      weight: '285g',
      finish: 'Matte Black',
      length: '40.5 inches',
      loft: 19,
      lie: 59,
      grip: 'Ping 360',
      material: 'Titanium Face'
    },
    tags: ['hybrid', 'ping', 'g425', 'versatile', 'accuracy']
  },
  {
    id: 'cleveland-rtx-6-wedge',
    name: 'Cleveland RTX 6 Wedge',
    brand: 'Cleveland',
    category: 'wedges',
    price: 179.99,
    description: 'Premium wedge with advanced groove technology',
    specifications: {
      model: 'RTX 6',
      year: 2023,
      weight: '305g',
      finish: 'Tour Satin',
      length: '35.5 inches',
      loft: 56,
      lie: 64,
      grip: 'Golf Pride Tour Velvet',
      material: 'Soft Carbon Steel'
    },
    tags: ['wedge', 'cleveland', 'rtx-6', 'grooves', 'spin']
  }
];

// Create placeholder SVG images
function createPlaceholderSVG(width, height, text, backgroundColor = '#f3f4f6', textColor = '#6b7280') {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${backgroundColor}"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="${textColor}" font-family="Arial, sans-serif" font-size="14" font-weight="500">
        ${text}
      </text>
    </svg>
  `;
}

function createBrandLogoSVG(brandName, width = 400, height = 200) {
  const initials = brandName.split(' ').map(word => word[0]).join('');
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1f2937"/>
      <circle cx="200" cy="100" r="60" fill="#3b82f6"/>
      <text x="200" y="110" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="24" font-weight="bold">
        ${initials}
      </text>
      <text x="200" y="140" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="12">
        ${brandName}
      </text>
    </svg>
  `;
}

function createProductImageSVG(productName, category, width = 800, height = 600) {
  const categoryColors = {
    drivers: '#ef4444',
    irons: '#3b82f6',
    putters: '#10b981',
    wedges: '#f59e0b',
    'fairway-woods': '#8b5cf6',
    hybrids: '#06b6d4',
    accessories: '#84cc16',
    collectibles: '#f97316'
  };

  const color = categoryColors[category] || '#6b7280';
  
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f9fafb"/>
      <rect x="50" y="100" width="700" height="400" rx="20" fill="${color}" opacity="0.1"/>
      <circle cx="400" cy="300" r="80" fill="${color}" opacity="0.3"/>
      <text x="400" y="280" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="32" font-weight="bold">
        Golf
      </text>
      <text x="400" y="320" text-anchor="middle" fill="${color}" font-family="Arial, sans-serif" font-size="24">
        ${category.charAt(0).toUpperCase() + category.slice(1)}
      </text>
      <text x="400" y="420" text-anchor="middle" fill="#6b7280" font-family="Arial, sans-serif" font-size="16">
        ${productName}
      </text>
    </svg>
  `;
}

async function uploadSVGToS3(key, svgContent, contentType = 'image/svg+xml') {
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: svgContent,
    ContentType: contentType,
    CacheControl: 'max-age=31536000', // 1 year cache
    Metadata: {
      'uploaded-by': 'populate-images-script',
      'uploaded-at': new Date().toISOString()
    }
  };

  try {
    await s3.upload(params).promise();
    console.log(`✅ Uploaded: ${key}`);
    return `${CDN_DOMAIN}/${key}`;
  } catch (error) {
    console.error(`❌ Failed to upload ${key}:`, error.message);
    return null;
  }
}

async function populateImages() {
  console.log('🚀 Starting image population...\n');

  // Upload brand logos
  console.log('📸 Uploading brand logos...');
  for (const brand of brands) {
    const logoSVG = createBrandLogoSVG(brand.name);
    const key = `brands/${brand.slug}-logo.svg`;
    await uploadSVGToS3(key, logoSVG);
  }

  // Upload category images
  console.log('\n📂 Uploading category images...');
  for (const category of categories) {
    const categorySVG = createPlaceholderSVG(800, 600, category.name, '#f3f4f6', '#374151');
    const key = `categories/${category.slug}.svg`;
    await uploadSVGToS3(key, categorySVG);
  }

  // Upload product images
  console.log('\n🏌️ Uploading product images...');
  for (const product of products) {
    const productSVG = createProductImageSVG(product.name, product.category);
    const key = `products/${product.category}/${product.id}.svg`;
    await uploadSVGToS3(key, productSVG);

    // Create thumbnails
    const thumbnailSVG = createProductImageSVG(product.name, product.category, 300, 225);
    const thumbnailKey = `products/thumbnails/${product.id}.svg`;
    await uploadSVGToS3(thumbnailKey, thumbnailSVG);
  }

  // Upload placeholder images
  console.log('\n🖼️ Uploading placeholder images...');
  const placeholderSVG = createPlaceholderSVG(400, 300, 'Golf Club Image', '#e5e7eb', '#9ca3af');
  await uploadSVGToS3('products/placeholder-golf-club.svg', placeholderSVG);

  console.log('\n✨ Image population completed!');
  console.log(`🌐 Images are available at: ${CDN_DOMAIN}/`);
  console.log('\n📁 Folder structure:');
  console.log('├── brands/ (brand logos)');
  console.log('├── categories/ (category images)');
  console.log('├── products/');
  console.log('│   ├── drivers/ (driver images)');
  console.log('│   ├── irons/ (iron images)');
  console.log('│   ├── putters/ (putter images)');
  console.log('│   ├── wedges/ (wedge images)');
  console.log('│   ├── fairway-woods/ (fairway wood images)');
  console.log('│   ├── hybrids/ (hybrid images)');
  console.log('│   ├── thumbnails/ (product thumbnails)');
  console.log('│   └── placeholder-golf-club.svg');
  console.log('└── temp/ (temporary uploads)');
}

// Run the script
if (require.main === module) {
  populateImages().catch(console.error);
}

module.exports = {
  populateImages,
  createPlaceholderSVG,
  createBrandLogoSVG,
  createProductImageSVG,
  brands,
  categories,
  products
};
