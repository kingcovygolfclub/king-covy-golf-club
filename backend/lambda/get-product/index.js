const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || 'king-covy-products';

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    const productId = event.pathParameters?.id;

    if (!productId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Product ID is required'
        })
      };
    }

    const params = {
      TableName: PRODUCTS_TABLE,
      Key: {
        id: productId
      }
    };

    console.log('DynamoDB params:', JSON.stringify(params, null, 2));

    const result = await dynamodb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Product not found'
        })
      };
    }

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
        data: result.Item
      })
    };

  } catch (error) {
    console.error('Error fetching product:', error);
    
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
        error: 'Failed to fetch product',
        message: error.message
      })
    };
  }
};
