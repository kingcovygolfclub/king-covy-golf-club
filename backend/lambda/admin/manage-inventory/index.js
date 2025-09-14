const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand, GetCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || 'king-covy-products';
const INVENTORY_TABLE = process.env.INVENTORY_TABLE || 'king-covy-inventory';

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    const body = JSON.parse(event.body || '{}');
    const { action, productId, quantity, reason } = body;

    if (!action || !productId) {
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
          error: 'Missing required fields: action and productId are required'
        })
      };
    }

    // Get current product and inventory
    const [productResult, inventoryResult] = await Promise.all([
      dynamodb.send(new GetCommand({
        TableName: PRODUCTS_TABLE,
        Key: { id: productId }
      })),
      dynamodb.send(new GetCommand({
        TableName: INVENTORY_TABLE,
        Key: { productId: productId }
      }))
    ]);

    if (!productResult.Item) {
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: false,
          error: 'Product not found'
        })
      };
    }

    const product = productResult.Item;
    const inventory = inventoryResult.Item || { stock: 0, reserved: 0 };
    const currentStock = inventory.stock || 0;
    const timestamp = new Date().toISOString();

    let newStock = currentStock;
    let updateMessage = '';

    // Perform inventory action
    switch (action.toLowerCase()) {
      case 'restock':
        if (!quantity || quantity <= 0) {
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
              error: 'Restock quantity must be greater than 0'
            })
          };
        }
        newStock = currentStock + parseInt(quantity);
        updateMessage = `Restocked ${quantity} units`;
        break;

      case 'adjust':
        if (quantity === undefined || quantity < 0) {
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
              error: 'Adjustment quantity must be 0 or greater'
            })
          };
        }
        newStock = parseInt(quantity);
        updateMessage = `Adjusted stock to ${quantity} units`;
        break;

      case 'reserve':
        if (!quantity || quantity <= 0) {
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
              error: 'Reserve quantity must be greater than 0'
            })
          };
        }
        if (currentStock < quantity) {
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
              error: 'Insufficient stock to reserve'
            })
          };
        }
        newStock = currentStock - parseInt(quantity);
        updateMessage = `Reserved ${quantity} units`;
        break;

      default:
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
            error: 'Invalid action. Supported actions: restock, adjust, reserve'
          })
        };
    }

    // Update product stock
    await dynamodb.send(new UpdateCommand({
      TableName: PRODUCTS_TABLE,
      Key: { id: productId },
      UpdateExpression: 'SET stock = :stock, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':stock': newStock,
        ':updatedAt': timestamp
      }
    }));

    // Update inventory record
    const inventoryUpdateExpression = action.toLowerCase() === 'restock' 
      ? 'SET stock = :stock, lastUpdated = :lastUpdated, lastRestocked = :lastRestocked'
      : 'SET stock = :stock, lastUpdated = :lastUpdated';

    const inventoryExpressionValues = {
      ':stock': newStock,
      ':lastUpdated': timestamp
    };

    if (action.toLowerCase() === 'restock') {
      inventoryExpressionValues[':lastRestocked'] = timestamp;
    }

    await dynamodb.send(new UpdateCommand({
      TableName: INVENTORY_TABLE,
      Key: { productId: productId },
      UpdateExpression: inventoryUpdateExpression,
      ExpressionAttributeValues: inventoryExpressionValues
    }));

    // Get updated product
    const updatedProduct = await dynamodb.send(new GetCommand({
      TableName: PRODUCTS_TABLE,
      Key: { id: productId }
    }));

    console.log(`Inventory ${action} completed for product ${productId}: ${currentStock} -> ${newStock}`);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        data: {
          product: updatedProduct.Item,
          inventoryChange: {
            action: action,
            previousStock: currentStock,
            newStock: newStock,
            change: newStock - currentStock,
            message: updateMessage,
            reason: reason || '',
            timestamp: timestamp
          }
        }
      })
    };

  } catch (error) {
    console.error('Error managing inventory:', error);
    
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
        error: 'Failed to manage inventory',
        message: error.message
      })
    };
  }
};
