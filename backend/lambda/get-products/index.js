const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || 'king-covy-products';

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    };
  }

  try {
    const {
      category,
      brand,
      condition,
      priceMin,
      priceMax,
      inStock,
      featured,
      page = 1,
      limit = 20,
      sortBy = 'featured'
    } = event.queryStringParameters || {};

    let params = {
      TableName: PRODUCTS_TABLE,
      Limit: parseInt(limit)
    };

    // Handle pagination
    if (event.queryStringParameters?.lastEvaluatedKey) {
      params.ExclusiveStartKey = JSON.parse(event.queryStringParameters.lastEvaluatedKey);
    }

    // Build filter expression and attribute values
    let filterExpressions = [];
    let expressionAttributeValues = {};
    let expressionAttributeNames = {};

    // Category filter
    if (category) {
      filterExpressions.push('category = :category');
      expressionAttributeValues[':category'] = category;
    }

    // Brand filter
    if (brand) {
      filterExpressions.push('brand = :brand');
      expressionAttributeValues[':brand'] = brand;
    }

    // Condition filter
    if (condition) {
      filterExpressions.push('#condition = :condition');
      expressionAttributeNames['#condition'] = 'condition';
      expressionAttributeValues[':condition'] = condition;
    }

    // Price range filter
    if (priceMin || priceMax) {
      if (priceMin && priceMax) {
        filterExpressions.push('price BETWEEN :priceMin AND :priceMax');
        expressionAttributeValues[':priceMin'] = parseFloat(priceMin);
        expressionAttributeValues[':priceMax'] = parseFloat(priceMax);
      } else if (priceMin) {
        filterExpressions.push('price >= :priceMin');
        expressionAttributeValues[':priceMin'] = parseFloat(priceMin);
      } else if (priceMax) {
        filterExpressions.push('price <= :priceMax');
        expressionAttributeValues[':priceMax'] = parseFloat(priceMax);
      }
    }

    // Featured filter
    if (featured === 'true') {
      filterExpressions.push('featured = :featured');
      expressionAttributeValues[':featured'] = true;
    }

    // Add filter expression to params if any filters exist
    if (filterExpressions.length > 0) {
      params.FilterExpression = filterExpressions.join(' AND ');
      
      // Only add ExpressionAttributeValues if it has content
      if (Object.keys(expressionAttributeValues).length > 0) {
        params.ExpressionAttributeValues = expressionAttributeValues;
      }
      
      if (Object.keys(expressionAttributeNames).length > 0) {
        params.ExpressionAttributeNames = expressionAttributeNames;
      }
    }

    // Handle sorting
    if (category && sortBy !== 'featured') {
      // Use category GSI
      params.IndexName = 'category-index';
      params.KeyConditionExpression = 'category = :category';
      
      // Merge expression attribute values
      if (!params.ExpressionAttributeValues) {
        params.ExpressionAttributeValues = {};
      }
      params.ExpressionAttributeValues[':category'] = category;
    } else if (brand && sortBy !== 'featured') {
      // Use brand GSI
      params.IndexName = 'brand-index';
      params.KeyConditionExpression = 'brand = :brand';
      
      // Merge expression attribute values
      if (!params.ExpressionAttributeValues) {
        params.ExpressionAttributeValues = {};
      }
      params.ExpressionAttributeValues[':brand'] = brand;
    }

    console.log('DynamoDB params:', JSON.stringify(params, null, 2));

    const result = await dynamodb.send(new ScanCommand(params));

    // Apply client-side sorting if needed
    let products = result.Items || [];

    if (sortBy === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'newest') {
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Filter by stock if requested
    if (inStock === 'true') {
      products = products.filter(product => product.stock > 0);
    }

    // Calculate pagination info
    const totalPages = Math.ceil(products.length / parseInt(limit));
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedProducts = products.slice(startIndex, endIndex);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        data: paginatedProducts,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: products.length,
          totalPages,
          hasMore: result.LastEvaluatedKey ? true : false,
          lastEvaluatedKey: result.LastEvaluatedKey
        }
      })
    };

  } catch (error) {
    console.error('Error fetching products:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch products',
        message: error.message
      })
    };
  }
};
