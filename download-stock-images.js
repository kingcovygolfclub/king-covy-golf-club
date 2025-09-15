// Script to download and organize stock golf club images
const https = require('https');
const fs = require('fs');
const path = require('path');

// Free stock image URLs (using placeholder.com for now, but can be replaced with actual stock image URLs)
const stockImages = {
  products: {
    drivers: [
      {
        name: 'titleist-tsr3-driver.jpg',
        url: 'https://via.placeholder.com/400x300/1f2937/ffffff?text=Titleist+TSR3+Driver',
        description: 'Titleist TSR3 Driver'
      },
      {
        name: 'generic-driver.jpg',
        url: 'https://via.placeholder.com/400x300/1f2937/ffffff?text=Golf+Driver',
        description: 'Generic Golf Driver'
      }
    ],
    putters: [
      {
        name: 'scotty-cameron-newport-2.jpg',
        url: 'https://via.placeholder.com/400x300/059669/ffffff?text=Scotty+Cameron+Newport+2',
        description: 'Scotty Cameron Newport 2 Putter'
      },
      {
        name: 'generic-putter.jpg',
        url: 'https://via.placeholder.com/400x300/059669/ffffff?text=Golf+Putter',
        description: 'Generic Golf Putter'
      }
    ],
    irons: [
      {
        name: 'mizuno-mp20-irons.jpg',
        url: 'https://via.placeholder.com/400x300/0891b2/ffffff?text=Mizuno+MP-20+Irons',
        description: 'Mizuno MP-20 Irons'
      },
      {
        name: 'generic-irons.jpg',
        url: 'https://via.placeholder.com/400x300/0891b2/ffffff?text=Golf+Irons',
        description: 'Generic Golf Irons'
      }
    ],
    wedges: [
      {
        name: 'cleveland-rtx-6-wedge.jpg',
        url: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Cleveland+RTX+6+Wedge',
        description: 'Cleveland RTX 6 Wedge'
      },
      {
        name: 'vokey-sm9-wedge-set.jpg',
        url: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Vokey+SM9+Wedge+Set',
        description: 'Vokey SM9 Wedge Set'
      },
      {
        name: 'generic-wedge.jpg',
        url: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Golf+Wedge',
        description: 'Generic Golf Wedge'
      }
    ],
    'fairway-woods': [
      {
        name: 'taylormade-stealth-2-fairway.jpg',
        url: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=TaylorMade+Stealth+2+Fairway',
        description: 'TaylorMade Stealth 2 Fairway Wood'
      },
      {
        name: 'generic-fairway-wood.jpg',
        url: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Fairway+Wood',
        description: 'Generic Fairway Wood'
      }
    ]
  },
  categories: [
    {
      name: 'drivers.jpg',
      url: 'https://via.placeholder.com/400x300/1f2937/ffffff?text=Golf+Drivers',
      description: 'Golf Drivers Category'
    },
    {
      name: 'putters.jpg',
      url: 'https://via.placeholder.com/400x300/059669/ffffff?text=Golf+Putters',
      description: 'Golf Putters Category'
    },
    {
      name: 'irons.jpg',
      url: 'https://via.placeholder.com/400x300/0891b2/ffffff?text=Golf+Irons',
      description: 'Golf Irons Category'
    },
    {
      name: 'wedges.jpg',
      url: 'https://via.placeholder.com/400x300/f59e0b/ffffff?text=Golf+Wedges',
      description: 'Golf Wedges Category'
    },
    {
      name: 'fairway-woods.jpg',
      url: 'https://via.placeholder.com/400x300/8b5cf6/ffffff?text=Fairway+Woods',
      description: 'Fairway Woods Category'
    },
    {
      name: 'hybrids.jpg',
      url: 'https://via.placeholder.com/400x300/7c3aed/ffffff?text=Golf+Hybrids',
      description: 'Golf Hybrids Category'
    },
    {
      name: 'accessories.jpg',
      url: 'https://via.placeholder.com/400x300/6b7280/ffffff?text=Golf+Accessories',
      description: 'Golf Accessories Category'
    },
    {
      name: 'collectibles.jpg',
      url: 'https://via.placeholder.com/400x300/92400e/ffffff?text=Golf+Collectibles',
      description: 'Golf Collectibles Category'
    }
  ],
  brands: [
    {
      name: 'titleist-logo.png',
      url: 'https://via.placeholder.com/200x100/1f2937/ffffff?text=Titleist',
      description: 'Titleist Logo'
    },
    {
      name: 'callaway-logo.png',
      url: 'https://via.placeholder.com/200x100/059669/ffffff?text=Callaway',
      description: 'Callaway Logo'
    },
    {
      name: 'taylormade-logo.png',
      url: 'https://via.placeholder.com/200x100/8b5cf6/ffffff?text=TaylorMade',
      description: 'TaylorMade Logo'
    },
    {
      name: 'ping-logo.png',
      url: 'https://via.placeholder.com/200x100/0891b2/ffffff?text=Ping',
      description: 'Ping Logo'
    },
    {
      name: 'mizuno-logo.png',
      url: 'https://via.placeholder.com/200x100/f59e0b/ffffff?text=Mizuno',
      description: 'Mizuno Logo'
    },
    {
      name: 'scotty-cameron-logo.png',
      url: 'https://via.placeholder.com/200x100/059669/ffffff?text=Scotty+Cameron',
      description: 'Scotty Cameron Logo'
    },
    {
      name: 'odyssey-logo.png',
      url: 'https://via.placeholder.com/200x100/7c3aed/ffffff?text=Odyssey',
      description: 'Odyssey Logo'
    },
    {
      name: 'cleveland-logo.png',
      url: 'https://via.placeholder.com/200x100/f59e0b/ffffff?text=Cleveland',
      description: 'Cleveland Logo'
    },
    {
      name: 'bettinardi-logo.png',
      url: 'https://via.placeholder.com/200x100/92400e/ffffff?text=Bettinardi',
      description: 'Bettinardi Logo'
    },
    {
      name: 'cobra-logo.png',
      url: 'https://via.placeholder.com/200x100/dc2626/ffffff?text=Cobra',
      description: 'Cobra Logo'
    },
    {
      name: 'wilson-logo.png',
      url: 'https://via.placeholder.com/400x300/1f2937/ffffff?text=Wilson',
      description: 'Wilson Logo'
    },
    {
      name: 'srixon-logo.png',
      url: 'https://via.placeholder.com/200x100/0891b2/ffffff?text=Srixon',
      description: 'Srixon Logo'
    }
  ]
};

// Create directory structure
function createDirectories() {
  const directories = [
    'stock-images/products/drivers',
    'stock-images/products/putters',
    'stock-images/products/irons',
    'stock-images/products/wedges',
    'stock-images/products/fairway-woods',
    'stock-images/categories',
    'stock-images/brands'
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
}

// Download image function
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(filepath);
      });
      
      file.on('error', (err) => {
        fs.unlink(filepath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Download all images
async function downloadAllImages() {
  console.log('🚀 Starting stock image download...\n');
  
  createDirectories();
  
  let totalImages = 0;
  let downloadedImages = 0;
  
  // Count total images
  Object.values(stockImages.products).forEach(category => {
    totalImages += category.length;
  });
  totalImages += stockImages.categories.length;
  totalImages += stockImages.brands.length;
  
  console.log(`📊 Total images to download: ${totalImages}\n`);
  
  // Download product images
  for (const [category, images] of Object.entries(stockImages.products)) {
    console.log(`📦 Downloading ${category} images...`);
    for (const image of images) {
      try {
        const filepath = `stock-images/products/${category}/${image.name}`;
        await downloadImage(image.url, filepath);
        console.log(`   ✅ ${image.name} - ${image.description}`);
        downloadedImages++;
      } catch (error) {
        console.log(`   ❌ Failed to download ${image.name}: ${error.message}`);
      }
    }
    console.log('');
  }
  
  // Download category images
  console.log('📂 Downloading category images...');
  for (const image of stockImages.categories) {
    try {
      const filepath = `stock-images/categories/${image.name}`;
      await downloadImage(image.url, filepath);
      console.log(`   ✅ ${image.name} - ${image.description}`);
      downloadedImages++;
    } catch (error) {
      console.log(`   ❌ Failed to download ${image.name}: ${error.message}`);
    }
  }
  console.log('');
  
  // Download brand logos
  console.log('🏷️ Downloading brand logos...');
  for (const image of stockImages.brands) {
    try {
      const filepath = `stock-images/brands/${image.name}`;
      await downloadImage(image.url, filepath);
      console.log(`   ✅ ${image.name} - ${image.description}`);
      downloadedImages++;
    } catch (error) {
      console.log(`   ❌ Failed to download ${image.name}: ${error.message}`);
    }
  }
  
  console.log(`\n🎉 Download complete! ${downloadedImages}/${totalImages} images downloaded.`);
  console.log('\n📁 Images saved to: stock-images/');
  console.log('\n🔄 Next steps:');
  console.log('   1. Upload images to S3 bucket');
  console.log('   2. Update database with new image URLs');
  console.log('   3. Update frontend to use new images');
}

// Run the download
downloadAllImages().catch(console.error);
