const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const ORDERS_TABLE = process.env.ORDERS_TABLE || 'king-covy-orders';
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || 'king-covy-products';

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    const orderId = event.pathParameters?.id;
    const body = JSON.parse(event.body || '{}');
    const { status, trackingNumber, notes } = body;

    if (!orderId) {
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
          error: 'Order ID is required'
        })
      };
    }

    if (!status) {
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
          error: 'Status is required'
        })
      };
    }

    // Valid order statuses
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
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
          error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        })
      };
    }

    // Get current order
    const orderResult = await dynamodb.send(new GetCommand({
      TableName: ORDERS_TABLE,
      Key: { id: orderId }
    }));

    if (!orderResult.Item) {
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
          error: 'Order not found'
        })
      };
    }

    const currentOrder = orderResult.Item;
    const previousStatus = currentOrder.status;
    const timestamp = new Date().toISOString();

    // Prepare update expression
    let updateExpression = 'SET #status = :status, updatedAt = :updatedAt';
    let expressionAttributeNames = {
      '#status': 'status'
    };
    let expressionAttributeValues = {
      ':status': status,
      ':updatedAt': timestamp
    };

    // Add tracking number if provided
    if (trackingNumber) {
      updateExpression += ', trackingNumber = :trackingNumber';
      expressionAttributeValues[':trackingNumber'] = trackingNumber;
    }

    // Add notes if provided
    if (notes) {
      updateExpression += ', notes = :notes';
      expressionAttributeValues[':notes'] = notes;
    }

    // If order is being cancelled, restore inventory
    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      // Restore inventory for each item
      for (const item of currentOrder.items) {
        await dynamodb.send(new UpdateCommand({
          TableName: PRODUCTS_TABLE,
          Key: { id: item.productId },
          UpdateExpression: 'SET stock = stock + :quantity, updatedAt = :updatedAt',
          ExpressionAttributeValues: {
            ':quantity': item.quantity,
            ':updatedAt': timestamp
          }
        }));
      }

      updateExpression += ', paymentStatus = :paymentStatus';
      expressionAttributeValues[':paymentStatus'] = 'refunded';
    }

    // Update order status
    await dynamodb.send(new UpdateCommand({
      TableName: ORDERS_TABLE,
      Key: { id: orderId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    }));

    // Get updated order
    const updatedOrderResult = await dynamodb.send(new GetCommand({
      TableName: ORDERS_TABLE,
      Key: { id: orderId }
    }));

    const updatedOrder = updatedOrderResult.Item;

    // Create status change log entry
    const statusChange = {
      orderId: orderId,
      previousStatus: previousStatus,
      newStatus: status,
      timestamp: timestamp,
      trackingNumber: trackingNumber || null,
      notes: notes || null
    };

    console.log('Order status updated:', statusChange);

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
          order: updatedOrder,
          statusChange: statusChange,
          message: `Order status updated from ${previousStatus} to ${status}`
        }
      })
    };

  } catch (error) {
    console.error('Error updating order status:', error);
    
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
        error: 'Failed to update order status',
        message: error.message
      })
    };
  }
};
