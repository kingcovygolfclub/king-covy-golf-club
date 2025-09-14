// Script to populate your database with real products
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const sampleProducts = [
  {
    id: 'scotty-newport-2-2024',
    name: 'Scotty Cameron Newport 2',
    description: 'The legendary Newport 2 putter trusted by professionals worldwide. Features precision milled face technology for consistent roll and superior feel.',
    price: 429.99,
    originalPrice: 479.99,
    images: [
      'https://your-cdn.com/products/scotty-newport-2-front.jpg',
      'https://your-cdn.com/products/scotty-newport-2-back.jpg',
      'https://your-cdn.com/products/scotty-newport-2-sole.jpg'
    ],
    category: 'putters',
    brand: 'Scotty Cameron',
    condition: 'new',
    specifications: {
      model: 'Newport 2',
      year: 2024,
      weight: '350g',
      finish: 'Stainless Steel',
      length: '34 inches',
      loft: '3°',
      lie: '70°',
      grip: 'Scotty Cameron Matador',
      material: 'Stainless Steel'
    },
    stock: 12,
    isCustomizable: true,
    customizationOptions: {
      engraving: {
        available: true,
        maxLength: 20,
        locations: ['toe', 'heel', 'bumper']
      },
      grip: {
        available: true,
        options: [
          { id: 'standard', name: 'Standard Matador', price: 0, colors: ['black', 'red'] },
          { id: 'premium', name: 'Premium Leather', price: 35, colors: ['brown', 'black'] },
          { id: 'cord', name: 'Cord Grip', price: 20, colors: ['black', 'white'] }
        ]
      },
      shaft: {
        available: false,
        options: []
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    featured: true,
    tags: ['putter', 'scotty-cameron', 'blade', 'milled', 'professional'],
    sku: 'SC-NP2-2024-34',
    seoTitle: 'Scotty Cameron Newport 2 Putter - Premium Golf Equipment',
    seoDescription: 'Professional-grade Scotty Cameron Newport 2 putter with milled face technology. Trusted by tour professionals worldwide.'
  }
  // Add more products here...
];

async function seedProducts() {
  console.log('Starting to seed products...');
  
  for (const product of sampleProducts) {
    try {
      await dynamodb.put({
        TableName: 'king-covy-products',
        Item: product
      }).promise();
      
      console.log(`✅ Added product: ${product.name}`);
    } catch (error) {
      console.error(`❌ Failed to add product ${product.name}:`, error);
    }
  }
  
  console.log('Product seeding completed!');
}

// Run the seeding
seedProducts();
