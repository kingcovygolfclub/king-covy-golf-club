const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand, GetCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || 'king-covy-products';
const INVENTORY_TABLE = process.env.INVENTORY_TABLE || 'king-covy-inventory';

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    const productId = event.pathParameters?.id;
    const body = JSON.parse(event.body || '{}');

    if (!productId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT, OPTIONS',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Product ID is required'
        })
      };
    }

    // Get current product
    const currentProduct = await dynamodb.send(new GetCommand({
      TableName: PRODUCTS_TABLE,
      Key: { id: productId }
    }));

    if (!currentProduct.Item) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'PUT, OPTIONS',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Product not found'
        })
      };
    }

    const timestamp = new Date().toISOString();

    // Build update expression dynamically
    let updateExpression = 'SET updatedAt = :updatedAt';
    let expressionAttributeNames = {};
    let expressionAttributeValues = {
      ':updatedAt': timestamp
    };

    // Update fields if provided
    const allowedFields = ['name', 'description', 'price', 'category', 'brand', 'specifications', 'images', 'featured', 'condition', 'customizationOptions', 'status'];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateExpression += `, #${field} = :${field}`;
        expressionAttributeNames[`#${field}`] = field;
        
        if (field === 'price') {
          expressionAttributeValues[`:${field}`] = parseFloat(body[field]);
        } else if (field === 'featured') {
          expressionAttributeValues[`:${field}`] = body[field] === true || body[field] === 'true';
        } else {
          expressionAttributeValues[`:${field}`] = body[field];
        }
      }
    }

    // Update product
    await dynamodb.send(new UpdateCommand({
      TableName: PRODUCTS_TABLE,
      Key: { id: productId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    }));

    // Update stock if provided
    if (body.stock !== undefined) {
      const newStock = parseInt(body.stock);
      
      await dynamodb.send(new UpdateCommand({
        TableName: PRODUCTS_TABLE,
        Key: { id: productId },
        UpdateExpression: 'SET stock = :stock',
        ExpressionAttributeValues: {
          ':stock': newStock
        }
      }));

      // Update inventory record
      await dynamodb.send(new UpdateCommand({
        TableName: INVENTORY_TABLE,
        Key: { productId: productId },
        UpdateExpression: 'SET stock = :stock, lastUpdated = :lastUpdated',
        ExpressionAttributeValues: {
          ':stock': newStock,
          ':lastUpdated': timestamp
        }
      }));
    }

    // Get updated product
    const updatedProduct = await dynamodb.send(new GetCommand({
      TableName: PRODUCTS_TABLE,
      Key: { id: productId }
    }));

    console.log('Product updated successfully:', productId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PUT, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        data: {
          product: updatedProduct.Item,
          message: 'Product updated successfully'
        }
      })
    };

  } catch (error) {
    console.error('Error updating product:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'PUT, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to update product',
        message: error.message
      })
    };
  }
};
