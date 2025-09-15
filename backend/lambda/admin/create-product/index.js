const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || 'king-covy-products';
const INVENTORY_TABLE = process.env.INVENTORY_TABLE || 'king-covy-inventory';

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const {
      id,
      name,
      description,
      price,
      category,
      brand,
      specifications,
      images,
      stock,
      featured,
      condition,
      customizationOptions
    } = body;

    // Validate required fields
    if (!name || !price || !category || !brand) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: name, price, category, and brand are required'
        })
      };
    }

    // Use provided ID or generate one
    const productId = id || `prod_${uuidv4()}`;
    const timestamp = new Date().toISOString();

    // Create product object
    const product = {
      id: productId,
      name: name.trim(),
      description: description?.trim() || '',
      price: parseFloat(price),
      category: category.trim(),
      brand: brand.trim(),
      specifications: specifications || {},
      images: images || ['/placeholder-golf-club.jpg'],
      stock: parseInt(stock) || 0,
      featured: featured === true || featured === 'true',
      condition: condition || 'new',
      customizationOptions: customizationOptions || {},
      createdAt: timestamp,
      updatedAt: timestamp,
      status: 'active'
    };

    // Save product to database
    await dynamodb.send(new PutCommand({
      TableName: PRODUCTS_TABLE,
      Item: product
    }));

    // Create inventory record
    await dynamodb.send(new PutCommand({
      TableName: INVENTORY_TABLE,
      Item: {
        productId: productId,
        stock: product.stock,
        reserved: 0,
        lastUpdated: timestamp,
        lastRestocked: timestamp,
        lowStockThreshold: 5,
        reorderPoint: 10
      }
    }));

    console.log('Product created successfully:', productId);

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        data: {
          product: product,
          message: 'Product created successfully'
        }
      })
    };

  } catch (error) {
    console.error('Error creating product:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to create product',
        message: error.message
      })
    };
  }
};
