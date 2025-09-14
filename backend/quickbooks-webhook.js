/**
 * QuickBooks Webhook Handler
 * Processes webhook events from QuickBooks Online
 */

const QuickBooksIntegration = require('./quickbooks-integration');

class QuickBooksWebhookHandler {
  constructor() {
    this.qb = new QuickBooksIntegration();
  }

  /**
   * Process webhook payload from QuickBooks
   */
  async processWebhook(payload) {
    try {
      console.log('Received QuickBooks webhook:', payload);

      const { eventNotifications } = payload;

      for (const notification of eventNotifications) {
        const { realmId, dataChangeEvent } = notification;
        
        // Update company ID for this request
        this.qb.companyId = realmId;

        for (const event of dataChangeEvent.entities) {
          await this.processEntityEvent(event);
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error processing QuickBooks webhook:', error);
      throw error;
    }
  }

  /**
   * Process individual entity events
   */
  async processEntityEvent(event) {
    const { name, id, operation, lastUpdated } = event;

    console.log(`Processing ${operation} event for ${name} with ID ${id}`);

    switch (name) {
      case 'Invoice':
        await this.handleInvoiceEvent(id, operation, lastUpdated);
        break;
      case 'Customer':
        await this.handleCustomerEvent(id, operation, lastUpdated);
        break;
      case 'Item':
        await this.handleItemEvent(id, operation, lastUpdated);
        break;
      default:
        console.log(`Unhandled entity type: ${name}`);
    }
  }

  /**
   * Handle invoice-related events
   */
  async handleInvoiceEvent(invoiceId, operation, lastUpdated) {
    try {
      // Get invoice details from QuickBooks
      const invoice = await this.qb.makeRequest('GET', `/invoices/${invoiceId}`);
      
      if (operation === 'Update' && invoice.PaymentStatus === 'Paid') {
        // Invoice was paid - update order status
        await this.updateOrderStatusFromInvoice(invoice);
      } else if (operation === 'Delete') {
        // Invoice was deleted/voided - handle accordingly
        await this.handleInvoiceDeletion(invoice);
      }

    } catch (error) {
      console.error('Error handling invoice event:', error);
    }
  }

  /**
   * Handle customer-related events
   */
  async handleCustomerEvent(customerId, operation, lastUpdated) {
    try {
      // Handle customer updates if needed
      console.log(`Customer ${customerId} was ${operation.toLowerCase()}`);
      
      // You might want to sync customer data back to your system
      // or update customer information in your database
      
    } catch (error) {
      console.error('Error handling customer event:', error);
    }
  }

  /**
   * Handle item-related events
   */
  async handleItemEvent(itemId, operation, lastUpdated) {
    try {
      // Handle product updates if needed
      console.log(`Item ${itemId} was ${operation.toLowerCase()}`);
      
      // You might want to sync product data back to your system
      // or update pricing information
      
    } catch (error) {
      console.error('Error handling item event:', error);
    }
  }

  /**
   * Update order status based on invoice payment
   */
  async updateOrderStatusFromInvoice(invoice) {
    try {
      // Find the order by invoice reference
      const orderId = this.extractOrderIdFromInvoice(invoice);
      
      if (orderId) {
        // Update order status in your database
        await this.updateOrderInDatabase(orderId, 'paid');
        
        // Send confirmation email
        await this.sendPaymentConfirmationEmail(orderId);
        
        console.log(`Order ${orderId} marked as paid`);
      }
    } catch (error) {
      console.error('Error updating order from invoice:', error);
    }
  }

  /**
   * Handle invoice deletion/voiding
   */
  async handleInvoiceDeletion(invoice) {
    try {
      const orderId = this.extractOrderIdFromInvoice(invoice);
      
      if (orderId) {
        // Update order status to cancelled
        await this.updateOrderInDatabase(orderId, 'cancelled');
        
        // Restore inventory
        await this.restoreInventoryForOrder(orderId);
        
        console.log(`Order ${orderId} cancelled due to invoice deletion`);
      }
    } catch (error) {
      console.error('Error handling invoice deletion:', error);
    }
  }

  /**
   * Extract order ID from invoice private notes
   */
  extractOrderIdFromInvoice(invoice) {
    const privateNote = invoice.PrivateNote || '';
    const match = privateNote.match(/Order ID: (\w+)/);
    return match ? match[1] : null;
  }

  /**
   * Update order in database
   */
  async updateOrderInDatabase(orderId, status) {
    // Implement your database update logic here
    console.log(`Updating order ${orderId} to status: ${status}`);
    
    // Example DynamoDB update:
    /*
    const AWS = require('aws-sdk');
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    
    await dynamodb.update({
      TableName: 'king-covy-orders',
      Key: { id: orderId },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':updatedAt': new Date().toISOString()
      }
    }).promise();
    */
  }

  /**
   * Send payment confirmation email
   */
  async sendPaymentConfirmationEmail(orderId) {
    // Implement email sending logic
    console.log(`Sending payment confirmation email for order ${orderId}`);
  }

  /**
   * Restore inventory for cancelled order
   */
  async restoreInventoryForOrder(orderId) {
    // Implement inventory restoration logic
    console.log(`Restoring inventory for cancelled order ${orderId}`);
  }
}

module.exports = QuickBooksWebhookHandler;
