const AWS = require('aws-sdk');

// Configure AWS
AWS.config.update({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const PRODUCTS_TABLE = 'king-covy-products';
const INVENTORY_TABLE = 'king-covy-inventory';

// Sample products data
const sampleProducts = [
  {
    id: 'prod_001',
    name: 'Scotty Cameron Newport 2',
    description: 'Classic blade putter with milled face for consistent roll',
    price: 399.99,
    originalPrice: 449.99,
    images: ['/https://d1xso6am1gh0.cloudfront.net/products/placeholder-golf-club.svg'],
    category: 'putters',
    brand: 'Scotty Cameron',
    condition: 'excellent',
    stock: 3,
    isCustomizable: true,
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
          { id: 'premium', name: 'Premium Leather', price: 25, colors: ['brown', 'black'] }
        ]
      },
      shaft: {
        available: false,
        options: []
      }
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    featured: true,
    tags: ['putter', 'scotty-cameron', 'blade', 'milled', 'premium']
  },
  {
    id: 'prod_002',
    name: 'Titleist TSR3 Driver',
    description: 'Advanced driver with adjustable CG for maximum distance',
    price: 599.99,
    images: ['/https://d1xso6am1gh0.cloudfront.net/products/placeholder-golf-club.svg'],
    category: 'drivers',
    brand: 'Titleist',
    condition: 'new',
    stock: 5,
    isCustomizable: true,
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
    customizationOptions: {
      engraving: {
        available: true,
        maxLength: 15,
        locations: ['crown', 'sole']
      },
      grip: {
        available: true,
        options: [
          { id: 'standard', name: 'Tour Velvet', price: 0, colors: ['black', 'blue'] },
          { id: 'premium', name: 'Winn Dri-Tac', price: 20, colors: ['white', 'gray'] }
        ]
      },
      shaft: {
        available: true,
        options: [
          { id: 'standard', name: 'HZRDUS Smoke', price: 0, flex: 'stiff', weight: '60g' },
          { id: 'premium', name: 'Aldila Rogue', price: 100, flex: 'x-stiff', weight: '65g' }
        ]
      }
    },
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    featured: true,
    tags: ['driver', 'titleist', 'tsr3', 'adjustable', 'distance']
  },
  {
    id: 'prod_003',
    name: 'Mizuno MP-20 Irons',
    description: 'Forged muscle back irons for skilled players',
    price: 1299.99,
    images: ['/https://d1xso6am1gh0.cloudfront.net/products/placeholder-golf-club.svg'],
    category: 'irons',
    brand: 'Mizuno',
    condition: 'like-new',
    stock: 2,
    isCustomizable: true,
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
    customizationOptions: {
      engraving: {
        available: true,
        maxLength: 10,
        locations: ['hosel', 'back']
      },
      grip: {
        available: true,
        options: [
          { id: 'standard', name: 'Tour Velvet', price: 0, colors: ['black', 'white'] },
          { id: 'premium', name: 'Golf Pride MCC', price: 15, colors: ['black', 'gray'] }
        ]
      },
      shaft: {
        available: true,
        options: [
          { id: 'standard', name: 'KBS Tour', price: 0, flex: 'stiff', weight: '120g' },
          { id: 'premium', name: 'True Temper Dynamic Gold', price: 80, flex: 'x-stiff', weight: '130g' }
        ]
      }
    },
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
    featured: true,
    tags: ['irons', 'mizuno', 'mp-20', 'forged', 'muscle-back']
  },
  {
    id: 'prod_004',
    name: 'TaylorMade Stealth 2 Fairway Wood',
    description: 'High-performance fairway wood with carbon face technology',
    price: 299.99,
    images: ['/https://d1xso6am1gh0.cloudfront.net/products/placeholder-golf-club.svg'],
    category: 'fairway-woods',
    brand: 'TaylorMade',
    condition: 'new',
    stock: 8,
    isCustomizable: true,
    specifications: {
      model: 'Stealth 2',
      year: 2023,
      weight: '205g',
      finish: 'Matte Black',
      length: '43 inches',
      loft: 15,
      lie: 58,
      grip: 'TaylorMade Z-Grip',
      material: 'Carbon Composite'
    },
    customizationOptions: {
      engraving: {
        available: true,
        maxLength: 12,
        locations: ['crown', 'sole']
      },
      grip: {
        available: true,
        options: [
          { id: 'standard', name: 'Z-Grip', price: 0, colors: ['black', 'white'] },
          { id: 'premium', name: 'Golf Pride Tour Wrap', price: 15, colors: ['black', 'blue'] }
        ]
      },
      shaft: {
        available: true,
        options: [
          { id: 'standard', name: 'KBS TD', price: 0, flex: 'stiff', weight: '70g' },
          { id: 'premium', name: 'Project X HZRDUS', price: 75, flex: 'x-stiff', weight: '75g' }
        ]
      }
    },
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z',
    featured: false,
    tags: ['fairway-wood', 'taylormade', 'stealth-2', 'carbon', 'distance']
  },
  {
    id: 'prod_005',
    name: 'Vokey SM9 Wedge Set',
    description: 'Professional-grade wedges with precision milling',
    price: 499.99,
    images: ['/https://d1xso6am1gh0.cloudfront.net/products/placeholder-golf-club.svg'],
    category: 'wedges',
    brand: 'Titleist',
    condition: 'excellent',
    stock: 4,
    isCustomizable: true,
    specifications: {
      model: 'SM9',
      year: 2022,
      weight: '304g (52°)',
      finish: 'Tour Chrome',
      length: '35.5 inches',
      loft: '52°/56°/60°',
      lie: 64,
      grip: 'Golf Pride Tour Velvet',
      material: 'Forged Carbon Steel'
    },
    customizationOptions: {
      engraving: {
        available: true,
        maxLength: 8,
        locations: ['back', 'sole']
      },
      grip: {
        available: true,
        options: [
          { id: 'standard', name: 'Tour Velvet', price: 0, colors: ['black', 'white'] },
          { id: 'premium', name: 'Golf Pride MCC+4', price: 20, colors: ['black', 'gray'] }
        ]
      },
      shaft: {
        available: true,
        options: [
          { id: 'standard', name: 'True Temper Dynamic Gold', price: 0, flex: 'stiff', weight: '130g' },
          { id: 'premium', name: 'KBS Hi-Rev 2.0', price: 60, flex: 'stiff', weight: '120g' }
        ]
      }
    },
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    featured: false,
    tags: ['wedges', 'titleist', 'vokey', 'sm9', 'milled']
  }
];

async function seedProducts() {
  console.log('🌱 Seeding products table...');
  
  for (const product of sampleProducts) {
    try {
      await dynamodb.put({
        TableName: PRODUCTS_TABLE,
        Item: product
      }).promise();
      
      console.log(`✅ Added product: ${product.name}`);
      
      // Also add inventory record
      await dynamodb.put({
        TableName: INVENTORY_TABLE,
        Item: {
          productId: product.id,
          stock: product.stock,
          reserved: 0,
          available: product.stock,
          lowStockThreshold: 5,
          lastUpdated: new Date().toISOString(),
          lastRestocked: new Date().toISOString(),
          restockNotes: 'Initial stock'
        }
      }).promise();
      
      console.log(`✅ Added inventory for: ${product.name}`);
      
    } catch (error) {
      console.error(`❌ Error adding product ${product.name}:`, error.message);
    }
  }
  
  console.log('🎉 Products seeding completed!');
}

// Run the seeding
seedProducts().catch(console.error);
