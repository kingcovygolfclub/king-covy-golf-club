const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

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
    const { httpMethod, queryStringParameters } = event;
    const tableName = process.env.ORDERS_TABLE || 'king-covy-orders';

    if (httpMethod === 'GET') {
      let orders;

      if (queryStringParameters?.customerId) {
        // Get orders for specific customer
        const params = {
          TableName: tableName,
          IndexName: 'customerEmail-index',
          KeyConditionExpression: 'customerEmail = :customerEmail',
          ExpressionAttributeValues: {
            ':customerEmail': queryStringParameters.customerId
          }
        };
        orders = await docClient.send(new QueryCommand(params));
      } else if (queryStringParameters?.status) {
        // Get orders by status
        const params = {
          TableName: tableName,
          IndexName: 'status-index',
          KeyConditionExpression: '#status = :status',
          ExpressionAttributeNames: {
            '#status': 'status'
          },
          ExpressionAttributeValues: {
            ':status': queryStringParameters.status
          }
        };
        orders = await docClient.send(new QueryCommand(params));
      } else {
        // Get all orders
        const params = {
          TableName: tableName,
          Limit: queryStringParameters?.limit ? parseInt(queryStringParameters.limit) : 50
        };
        orders = await docClient.send(new ScanCommand(params));
      }

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
        },
        body: JSON.stringify({
          success: true,
          data: orders.Items || []
        })
      };
    }

    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Method not allowed'
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
        details: error.message
      })
    };
  }
};
