// Script to check what images actually exist in S3
const https = require('https');

// List of image URLs to check
const imageUrls = [
  'https://king-covy-assets.s3.amazonaws.com/products/putters/scotty-cameron-newport-2.svg',
  'https://king-covy-assets.s3.amazonaws.com/products/drivers/titleist-tsr3-driver.svg',
  'https://king-covy-assets.s3.amazonaws.com/products/irons/mizuno-mp20-irons.svg',
  'https://king-covy-assets.s3.amazonaws.com/products/wedges/cleveland-rtx-6-wedge.svg',
  'https://king-covy-assets.s3.amazonaws.com/products/fairway-woods/taylormade-stealth-2-fairway.svg',
  'https://king-covy-assets.s3.amazonaws.com/products/placeholder-golf-club.svg'
];

async function checkImage(url) {
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
          contentType: response.headers['content-type'],
          size: data.length,
          isPlaceholder: data.includes('Golf') || data.includes('placeholder') || data.includes('text'),
          contentPreview: data.substring(0, 300).replace(/\s+/g, ' ').trim()
        });
      });
    }).on('error', (error) => {
      reject({ url, error: error.message });
    });
  });
}

async function checkAllImages() {
  console.log('🔍 Checking S3 Images...\n');
  
  for (const url of imageUrls) {
    try {
      const result = await checkImage(url);
      console.log(`📁 ${url.split('/').pop()}`);
      console.log(`   Status: ${result.status}`);
      console.log(`   Content-Type: ${result.contentType}`);
      console.log(`   Size: ${result.size} bytes`);
      console.log(`   Is Placeholder: ${result.isPlaceholder ? '❌ YES' : '✅ NO'}`);
      console.log(`   Content Preview: ${result.contentPreview}`);
      console.log('');
    } catch (error) {
      console.log(`❌ Error checking ${url.split('/').pop()}: ${error.error}`);
      console.log('');
    }
  }
}

checkAllImages();
