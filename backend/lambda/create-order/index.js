const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const client = new DynamoDBClient({});
const dynamodb = DynamoDBDocumentClient.from(client);

const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE || 'king-covy-products';
const ORDERS_TABLE = process.env.ORDERS_TABLE || 'king-covy-orders';
const CUSTOMERS_TABLE = process.env.CUSTOMERS_TABLE || 'king-covy-customers';
const INVENTORY_TABLE = process.env.INVENTORY_TABLE || 'king-covy-inventory';

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));

  try {
    const body = JSON.parse(event.body || '{}');
    const {
      customerInfo,
      items,
      shippingAddress,
      billingAddress,
      notes
    } = body;

    // Validate required fields
    if (!customerInfo || !items || !Array.isArray(items) || items.length === 0) {
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
          error: 'Missing required fields: customerInfo and items are required'
        })
      };
    }

    // Generate order ID
    const orderId = `order_${uuidv4()}`;
    const timestamp = new Date().toISOString();

    // Calculate totals and validate inventory
    let orderTotal = 0;
    let orderItems = [];
    let inventoryUpdates = [];

    for (const item of items) {
      // Get product details
      const productResult = await dynamodb.send(new GetCommand({
        TableName: PRODUCTS_TABLE,
        Key: { id: item.productId }
      }));

      if (!productResult.Item) {
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
            error: `Product not found: ${item.productId}`
          })
        };
      }

      const product = productResult.Item;

      // Check inventory
      if (product.stock < item.quantity) {
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
            error: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`
          })
        };
      }

      // Calculate item total
      const itemPrice = product.price;
      const itemTotal = itemPrice * item.quantity;
      orderTotal += itemTotal;

      // Prepare order item
      orderItems.push({
        productId: item.productId,
        name: product.name,
        price: itemPrice,
        quantity: item.quantity,
        total: itemTotal,
        customizations: item.customizations || {},
        image: product.images?.[0] || 'https://d1xso6am1gh0.cloudfront.net/products/placeholder-golf-club.svg'
      });

      // Prepare inventory update
      inventoryUpdates.push({
        productId: item.productId,
        quantityToReserve: item.quantity
      });
    }

    // Create or update customer
    let customerId = customerInfo.id;
    if (!customerId) {
      customerId = `customer_${uuidv4()}`;
      
      await dynamodb.send(new PutCommand({
        TableName: CUSTOMERS_TABLE,
        Item: {
          id: customerId,
          email: customerInfo.email,
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          phone: customerInfo.phone,
          addresses: {
            shipping: shippingAddress,
            billing: billingAddress || shippingAddress
          },
          createdAt: timestamp,
          updatedAt: timestamp,
          totalOrders: 0,
          totalSpent: 0
        }
      }));
    } else {
      // Update existing customer
      await dynamodb.send(new UpdateCommand({
        TableName: CUSTOMERS_TABLE,
        Key: { id: customerId },
        UpdateExpression: 'SET #addresses = :addresses, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#addresses': 'addresses'
        },
        ExpressionAttributeValues: {
          ':addresses': {
            shipping: shippingAddress,
            billing: billingAddress || shippingAddress
          },
          ':updatedAt': timestamp
        }
      }));
    }

    // Create order
    const order = {
      id: orderId,
      customerId: customerId,
      customerEmail: customerInfo.email,
      status: 'pending', // pending, confirmed, processing, shipped, delivered, cancelled
      items: orderItems,
      totals: {
        subtotal: orderTotal,
        tax: Math.round(orderTotal * 0.08 * 100) / 100, // 8% tax
        shipping: orderTotal > 100 ? 0 : 15, // Free shipping over $100
        total: 0 // Will be calculated below
      },
      shippingAddress: shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      notes: notes || '',
      createdAt: timestamp,
      updatedAt: timestamp,
      paymentStatus: 'pending', // pending, paid, failed, refunded
      shippingMethod: 'standard', // standard, express, overnight
      trackingNumber: null
    };

    // Calculate final total
    order.totals.total = order.totals.subtotal + order.totals.tax + order.totals.shipping;

    // Save order to database
    await dynamodb.send(new PutCommand({
      TableName: ORDERS_TABLE,
      Item: order
    }));

    // Update inventory (reserve items)
    for (const update of inventoryUpdates) {
      await dynamodb.send(new UpdateCommand({
        TableName: PRODUCTS_TABLE,
        Key: { id: update.productId },
        UpdateExpression: 'SET stock = stock - :quantity, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
          ':quantity': update.quantityToReserve,
          ':updatedAt': timestamp
        },
        ConditionExpression: 'stock >= :quantity' // Ensure we don't oversell
      }));
    }

    // Update customer totals
    await dynamodb.send(new UpdateCommand({
      TableName: CUSTOMERS_TABLE,
      Key: { id: customerId },
      UpdateExpression: 'SET totalOrders = totalOrders + :inc, totalSpent = totalSpent + :total, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':inc': 1,
        ':total': order.totals.total,
        ':updatedAt': timestamp
      }
    }));

    console.log('Order created successfully:', orderId);

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
          orderId: orderId,
          order: order,
          message: 'Order created successfully'
        }
      })
    };

  } catch (error) {
    console.error('Error creating order:', error);
    
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
        error: 'Failed to create order',
        message: error.message
      })
    };
  }
};
