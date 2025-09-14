/**
 * QuickBooks Online API Integration
 * Handles order synchronization and invoice creation
 */

const axios = require('axios');

class QuickBooksIntegration {
  constructor() {
    this.clientId = process.env.QB_CLIENT_ID;
    this.clientSecret = process.env.QB_CLIENT_SECRET;
    this.redirectUri = process.env.QB_REDIRECT_URI;
    this.scope = process.env.QB_SCOPE || 'com.intuit.quickbooks.accounting';
    this.baseUrl = 'https://sandbox-quickbooks.api.intuit.com'; // Use production URL for live
    this.accessToken = null;
    this.refreshToken = null;
    this.companyId = process.env.QB_COMPANY_ID;
  }

  /**
   * Get authorization URL for OAuth flow
   */
  getAuthorizationUrl() {
    const params = new URLSearchParams({
      client_id: this.clientId,
      scope: this.scope,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      access_type: 'offline',
      state: 'random_state_string' // In production, use a secure random string
    });

    return `https://appcenter.intuit.com/connect/oauth2?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code) {
    try {
      const response = await axios.post('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri
      }, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.accessToken = response.data.access_token;
      this.refreshToken = response.data.refresh_token;

      return {
        accessToken: this.accessToken,
        refreshToken: this.refreshToken,
        expiresIn: response.data.expires_in
      };
    } catch (error) {
      console.error('Error exchanging code for token:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken() {
    try {
      const response = await axios.post('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken
      }, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.accessToken = response.data.access_token;
      
      return {
        accessToken: this.accessToken,
        expiresIn: response.data.expires_in
      };
    } catch (error) {
      console.error('Error refreshing token:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Make authenticated API request to QuickBooks
   */
  async makeRequest(method, endpoint, data = null) {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}/v3/company/${this.companyId}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data
      });

      return response.data;
    } catch (error) {
      console.error('QuickBooks API error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Create or find customer in QuickBooks
   */
  async createOrFindCustomer(orderData) {
    const customerData = {
      Name: `${orderData.customerName}`,
      CompanyName: orderData.billingAddress.company || '',
      PrimaryEmailAddr: {
        Address: orderData.customerEmail
      },
      PrimaryPhone: {
        FreeFormNumber: orderData.shippingAddress.phone || ''
      },
      BillAddr: {
        Line1: orderData.billingAddress.address1,
        Line2: orderData.billingAddress.address2 || '',
        City: orderData.billingAddress.city,
        CountrySubDivisionCode: orderData.billingAddress.state,
        PostalCode: orderData.billingAddress.zipCode,
        Country: orderData.billingAddress.country
      },
      ShipAddr: {
        Line1: orderData.shippingAddress.address1,
        Line2: orderData.shippingAddress.address2 || '',
        City: orderData.shippingAddress.city,
        CountrySubDivisionCode: orderData.shippingAddress.state,
        PostalCode: orderData.shippingAddress.zipCode,
        Country: orderData.shippingAddress.country
      }
    };

    try {
      // First, try to find existing customer by email
      const searchResponse = await this.makeRequest('GET', `/customers?query=PrimaryEmailAddr = '${orderData.customerEmail}'`);
      
      if (searchResponse.QueryResponse && searchResponse.QueryResponse.Customer && searchResponse.QueryResponse.Customer.length > 0) {
        return searchResponse.QueryResponse.Customer[0].Id;
      }

      // Create new customer if not found
      const createResponse = await this.makeRequest('POST', '/customers', customerData);
      return createResponse.Customer.Id;
    } catch (error) {
      console.error('Error creating/finding customer:', error);
      throw error;
    }
  }

  /**
   * Create or find product in QuickBooks
   */
  async createOrFindProduct(item) {
    const productData = {
      Name: `Golf Product - ${item.productId}`,
      Type: 'Service', // or 'Inventory' if you track inventory in QuickBooks
      IncomeAccountRef: {
        value: process.env.QB_SALES_ACCOUNT_ID // Configure this in your QB chart of accounts
      },
      UnitPrice: item.unitPrice
    };

    try {
      // Try to find existing product
      const searchResponse = await this.makeRequest('GET', `/items?query=Name = 'Golf Product - ${item.productId}'`);
      
      if (searchResponse.QueryResponse && searchResponse.QueryResponse.Item && searchResponse.QueryResponse.Item.length > 0) {
        return searchResponse.QueryResponse.Item[0].Id;
      }

      // Create new product if not found
      const createResponse = await this.makeRequest('POST', '/items', productData);
      return createResponse.Item.Id;
    } catch (error) {
      console.error('Error creating/finding product:', error);
      throw error;
    }
  }

  /**
   * Create invoice in QuickBooks
   */
  async createInvoice(orderData) {
    try {
      // Get or create customer
      const customerId = await this.createOrFindCustomer(orderData);

      // Create line items
      const lineItems = [];
      for (const item of orderData.items) {
        const productId = await this.createOrFindProduct(item);
        
        lineItems.push({
          DetailType: 'SalesItemLineDetail',
          Amount: item.unitPrice * item.quantity,
          SalesItemLineDetail: {
            ItemRef: {
              value: productId
            },
            Qty: item.quantity,
            UnitPrice: item.unitPrice
          }
        });
      }

      // Add tax line if applicable
      if (orderData.tax > 0) {
        lineItems.push({
          DetailType: 'TaxLineDetail',
          Amount: orderData.tax,
          TaxLineDetail: {
            TaxRateRef: {
              value: process.env.QB_TAX_RATE_ID // Configure this in your QB tax rates
            }
          }
        });
      }

      // Add shipping line if applicable
      if (orderData.shipping > 0) {
        lineItems.push({
          DetailType: 'SalesItemLineDetail',
          Amount: orderData.shipping,
          SalesItemLineDetail: {
            ItemRef: {
              value: process.env.QB_SHIPPING_ITEM_ID // Create a shipping item in QB
            },
            Qty: 1,
            UnitPrice: orderData.shipping
          }
        });
      }

      const invoiceData = {
        CustomerRef: {
          value: customerId
        },
        TxnDate: new Date().toISOString().split('T')[0],
        DueDate: new Date().toISOString().split('T')[0],
        PrivateNote: `Order ID: ${orderData.id}`,
        Line: lineItems
      };

      const response = await this.makeRequest('POST', '/invoices', invoiceData);
      
      return {
        invoiceId: response.Invoice.Id,
        invoiceNumber: response.Invoice.DocNumber,
        totalAmount: response.Invoice.TotalAmt
      };
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  /**
   * Update invoice status
   */
  async updateInvoiceStatus(invoiceId, status) {
    try {
      // Get current invoice
      const getResponse = await this.makeRequest('GET', `/invoices/${invoiceId}`);
      const invoice = getResponse.QueryResponse.Invoice[0];

      // Update based on status
      if (status === 'paid') {
        invoice.PaymentStatus = 'Paid';
      } else if (status === 'cancelled') {
        invoice.EmailStatus = 'NotSet';
        // You might want to void the invoice instead
      }

      const response = await this.makeRequest('POST', `/invoices`, invoice);
      return response.Invoice;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  }

  /**
   * Get company information
   */
  async getCompanyInfo() {
    try {
      const response = await this.makeRequest('GET', '/companyinfo/1');
      return response.QueryResponse.CompanyInfo[0];
    } catch (error) {
      console.error('Error getting company info:', error);
      throw error;
    }
  }
}

module.exports = QuickBooksIntegration;
