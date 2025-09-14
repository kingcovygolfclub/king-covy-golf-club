const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const ORDERS_TABLE = process.env.ORDERS_TABLE || 'king-covy-orders';

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    const customerEmail = event.queryStringParameters?.email;
    const limit = parseInt(event.queryStringParameters?.limit || '10');
    const lastEvaluatedKey = event.queryStringParameters?.lastEvaluatedKey;

    if (!customerEmail) {
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
          error: 'Customer email is required'
        })
      };
    }

    // Query orders by customer email using GSI
    const params = {
      TableName: ORDERS_TABLE,
      IndexName: 'customerEmail-index',
      KeyConditionExpression: 'customerEmail = :email',
      ExpressionAttributeValues: {
        ':email': customerEmail
      },
      ScanIndexForward: false, // Sort by creation date descending (newest first)
      Limit: limit
    };

    if (lastEvaluatedKey) {
      params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastEvaluatedKey));
    }

    const result = await dynamodb.send(new QueryCommand(params));

    // Format orders for response
    const orders = result.Items || [];
    
    // Add summary information
    const orderSummary = {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + order.totals.total, 0),
      orderStatuses: orders.reduce((statuses, order) => {
        statuses[order.status] = (statuses[order.status] || 0) + 1;
        return statuses;
      }, {})
    };

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
        data: {
          orders: orders,
          summary: orderSummary,
          pagination: {
            limit: limit,
            hasMore: !!result.LastEvaluatedKey,
            lastEvaluatedKey: result.LastEvaluatedKey
          }
        }
      })
    };

  } catch (error) {
    console.error('Error fetching customer orders:', error);
    
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
        error: 'Failed to fetch customer orders',
        message: error.message
      })
    };
  }
};
