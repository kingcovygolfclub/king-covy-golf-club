// Script to check which products have placeholder images vs real images
const https = require('https');

// Product data from the shop page
const products = [
  {
    id: 'scotty-cameron-newport-2',
    name: 'Scotty Cameron Newport 2',
    imageUrl: 'https://king-covy-assets.s3.amazonaws.com/products/putters/scotty-cameron-newport-2.svg'
  },
  {
    id: 'titleist-tsr3-driver',
    name: 'Titleist TSR3 Driver',
    imageUrl: 'https://king-covy-assets.s3.amazonaws.com/products/drivers/titleist-tsr3-driver.svg'
  },
  {
    id: 'mizuno-mp20-irons',
    name: 'Mizuno MP-20 Irons',
    imageUrl: 'https://king-covy-assets.s3.amazonaws.com/products/irons/mizuno-mp20-irons.svg'
  }
];

async function checkImageContent(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        resolve({
          url,
          status: response.statusCode,
          content: data.substring(0, 200), // First 200 chars
          isPlaceholder: data.includes('Golf') || data.includes('placeholder')
        });
      });
    }).on('error', (error) => {
      reject({ url, error: error.message });
    });
  });
}

async function checkAllImages() {
  console.log('🔍 Checking product images...\n');
  
  for (const product of products) {
    try {
      const result = await checkImageContent(product.imageUrl);
      console.log(`📦 ${product.name}`);
      console.log(`   URL: ${result.url}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Is Placeholder: ${result.isPlaceholder ? '❌ YES' : '✅ NO'}`);
      console.log(`   Content Preview: ${result.content}`);
      console.log('');
    } catch (error) {
      console.log(`❌ Error checking ${product.name}: ${error.error}`);
      console.log('');
    }
  }
}

checkAllImages();
