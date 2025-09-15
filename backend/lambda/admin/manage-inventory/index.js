const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand, GetCommand, ScanCommand, PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
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
    const httpMethod = event.httpMethod;
    const body = event.body ? JSON.parse(event.body) : {};
    const queryParams = event.queryStringParameters || {};

    // Handle GET requests - fetch inventory items
    if (httpMethod === 'GET') {
      const limit = parseInt(queryParams.limit) || 1000;
      const status = queryParams.status;
      const clubType = queryParams.clubType;
      const itemType = queryParams.itemType;

      // Build scan parameters
      let scanParams = {
        TableName: INVENTORY_TABLE,
        Limit: limit
      };

      // Add filters if provided
      let filterExpressions = [];
      let expressionAttributeValues = {};
      let expressionAttributeNames = {};

      if (status && status !== 'all') {
        filterExpressions.push('#status = :status');
        expressionAttributeNames['#status'] = 'status';
        expressionAttributeValues[':status'] = status;
      }

      if (clubType && clubType !== 'all') {
        filterExpressions.push('#clubType = :clubType');
        expressionAttributeNames['#clubType'] = 'clubType';
        expressionAttributeValues[':clubType'] = clubType;
      }

      if (itemType && itemType !== 'all') {
        filterExpressions.push('#itemType = :itemType');
        expressionAttributeNames['#itemType'] = 'itemType';
        expressionAttributeValues[':itemType'] = itemType;
      }

      if (filterExpressions.length > 0) {
        scanParams.FilterExpression = filterExpressions.join(' AND ');
        scanParams.ExpressionAttributeValues = expressionAttributeValues;
        scanParams.ExpressionAttributeNames = expressionAttributeNames;
      }

      const result = await dynamodb.send(new ScanCommand(scanParams));
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: true,
          data: result.Items || []
        })
      };
    }

    // Handle POST requests - create new inventory item
    if (httpMethod === 'POST') {
      const {
        itemId,
        brand,
        model,
        clubType,
        condition,
        purchaseCost,
        customizationCost,
        totalCost,
        status,
        itemType,
        marketingExpenseType,
        marketingCampaign,
        marketingPlatform,
        marketingSpend,
        binLocation,
        notes
      } = body;

      // Validate required fields
      if (!itemId || !brand || !model || !purchaseCost) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            success: false,
            error: 'Missing required fields: itemId, brand, model, and purchaseCost are required'
          })
        };
      }

      const timestamp = new Date().toISOString();
      const inventoryItem = {
        productId: itemId, // Use itemId as the primary key
        brand,
        model,
        clubType: clubType || 'accessories',
        condition: condition || 'new',
        purchaseCost: parseFloat(purchaseCost),
        customizationCost: parseFloat(customizationCost) || 0,
        totalCost: parseFloat(totalCost) || (parseFloat(purchaseCost) + (parseFloat(customizationCost) || 0)),
        status: status || 'inventory',
        itemType: itemType || 'product',
        marketingExpenseType,
        marketingCampaign,
        marketingPlatform,
        marketingSpend: marketingSpend ? parseFloat(marketingSpend) : undefined,
        binLocation,
        notes,
        createdAt: timestamp,
        updatedAt: timestamp
      };

      await dynamodb.send(new PutCommand({
        TableName: INVENTORY_TABLE,
        Item: inventoryItem
      }));

      return {
        statusCode: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          success: true,
          data: inventoryItem
        })
      };
    }

    // Handle DELETE requests - delete inventory item
    if (httpMethod === 'DELETE') {
      const itemId = event.pathParameters?.itemId || body.itemId;
      
      if (!itemId) {
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            success: false,
            error: 'Missing required field: itemId is required'
          })
        };
      }

      try {
        // Delete from inventory table
        await dynamodb.send(new DeleteCommand({
          TableName: INVENTORY_TABLE,
          Key: { productId: itemId }
        }));

        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            success: true,
            message: 'Inventory item deleted successfully'
          })
        };
      } catch (error) {
        console.error('Error deleting inventory item:', error);
        return {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            success: false,
            error: 'Failed to delete inventory item',
            details: error.message
          })
        };
      }
    }

    // Handle inventory management operations (existing functionality)
    const { action, productId, quantity, reason } = body;

    if (!action || !productId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
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
