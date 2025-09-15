const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  try {
    const { httpMethod } = event;
    const productsTable = process.env.PRODUCTS_TABLE || 'king-covy-products';
    const ordersTable = process.env.ORDERS_TABLE || 'king-covy-orders';
    const customersTable = process.env.CUSTOMERS_TABLE || 'king-covy-customers';

    if (httpMethod === 'GET') {
      // Get all data in parallel
      const [productsResult, ordersResult, customersResult] = await Promise.all([
        docClient.send(new ScanCommand({ TableName: productsTable })),
        docClient.send(new ScanCommand({ TableName: ordersTable })),
        docClient.send(new ScanCommand({ TableName: customersTable }))
      ]);

      const products = productsResult.Items || [];
      const orders = ordersResult.Items || [];
      const customers = customersResult.Items || [];

      // Calculate stats
      const totalProducts = products.length;
      const totalOrders = orders.length;
      const totalCustomers = customers.length;
      
      // Calculate total revenue from completed orders
      const totalRevenue = orders
        .filter(order => order.status === 'completed')
        .reduce((sum, order) => sum + (order.total || 0), 0);

      // Count low stock products (less than 5 in stock)
      const lowStockProducts = products.filter(product => product.stock < 5).length;

      // Count pending orders
      const pendingOrders = orders.filter(order => order.status === 'pending').length;

      const stats = {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue,
        lowStockProducts,
        pendingOrders
      };

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
          data: stats
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
