# King Covy Golf Club - E-commerce Platform

A modern, serverless e-commerce platform for selling boutique and collector's golf clubs, putters, accessories, and golf-related merchandise with customizations.

## 🏌️ Features

### Core E-commerce
- **Product Catalog**: Comprehensive product listings with filters and search
- **Shopping Cart**: Persistent cart with customization options
- **Checkout**: Secure Stripe payment integration
- **Order Management**: Real-time order tracking and status updates
- **Inventory Management**: Real-time stock tracking with DynamoDB

### Customizations
- **Engraving**: Personal engravings on clubs and accessories
- **Grip Options**: Custom grip selections with premium materials
- **Shaft Upgrades**: Professional shaft customization options

### Integrations
- **QuickBooks Online**: Automated invoice creation and accounting sync
- **Social Media**: Instagram Shopping, Sideline Swap, Facebook Marketplace
- **Analytics**: Comprehensive tracking and reporting

## 🏗️ Architecture

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Responsive Design** for all devices

### Backend
- **AWS Lambda** for serverless functions
- **API Gateway** for REST API endpoints
- **DynamoDB** for NoSQL database
- **S3 + CloudFront** for asset storage and CDN

### Payment & Accounting
- **Stripe** for payment processing
- **QuickBooks Online API** for accounting integration

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- AWS CLI configured
- Stripe account
- QuickBooks Online account (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/king-covy-frontend.git
   cd king-covy-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your configuration:
   ```env
   # AWS Configuration
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your-s3-bucket-name
   AWS_CLOUDFRONT_DOMAIN=your-cloudfront-domain.cloudfront.net
   
   # Stripe Configuration
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   
   # QuickBooks Online (Optional)
   QB_CLIENT_ID=your_quickbooks_client_id
   QB_CLIENT_SECRET=your_quickbooks_client_secret
   QB_COMPANY_ID=your_quickbooks_company_id
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
king-covy-frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── cart/              # Shopping cart page
│   │   ├── checkout/          # Checkout process
│   │   ├── products/          # Product detail pages
│   │   └── shop/              # Product listing page
│   ├── components/            # Reusable React components
│   │   ├── cart/              # Cart-related components
│   │   ├── layout/            # Header, Footer, etc.
│   │   ├── products/          # Product components
│   │   └── sections/          # Page sections
│   ├── context/               # React Context providers
│   ├── lib/                   # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Helper functions
├── backend/                   # Backend Lambda functions
│   ├── lambda/               # Individual Lambda functions
│   └── quickbooks-integration.js
├── deployment/               # AWS deployment scripts
├── docs/                     # Documentation
└── public/                   # Static assets
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler

# Database (if using local development)
npm run db:seed      # Seed database with sample data
npm run db:migrate   # Run database migrations
```

### Adding New Products

1. **Update the product data** in your DynamoDB table
2. **Add product images** to your S3 bucket
3. **Update the product feed** for social media integrations

Example product structure:
```json
{
  "id": "prod_123",
  "name": "Scotty Cameron Newport 2",
  "description": "Classic blade putter with milled face",
  "price": 399.99,
  "images": ["https://your-cdn.com/images/product.jpg"],
  "category": "putters",
  "brand": "Scotty Cameron",
  "condition": "excellent",
  "stock": 5,
  "isCustomizable": true,
  "customizationOptions": {
    "engraving": {
      "available": true,
      "maxLength": 20,
      "locations": ["toe", "heel"]
    },
    "grip": {
      "available": true,
      "options": [...]
    }
  }
}
```

## 🚀 Deployment

### Frontend (AWS Amplify)

1. **Install Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. **Initialize and deploy**
   ```bash
   amplify init
   amplify add hosting
   amplify publish
   ```

### Backend (Serverless Framework)

1. **Install Serverless**
   ```bash
   npm install -g serverless
   ```

2. **Deploy Lambda functions**
   ```bash
   cd backend
   serverless deploy
   ```

### Manual AWS Deployment

See the [AWS Deployment Guide](./deployment/aws-deployment.md) for detailed instructions.

## 🔧 Configuration

### DynamoDB Tables

The application requires the following DynamoDB tables:

- `king-covy-products` - Product catalog
- `king-covy-inventory` - Inventory tracking
- `king-covy-orders` - Order management
- `king-covy-customers` - Customer information

See [dynamodb-schemas.json](./backend/dynamodb-schemas.json) for complete schema definitions.

### Stripe Setup

1. **Create Stripe account** at [stripe.com](https://stripe.com)
2. **Get API keys** from Stripe Dashboard
3. **Set up webhook endpoint** at `/api/stripe-webhook`
4. **Configure webhook events**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`

### QuickBooks Integration

1. **Create QuickBooks app** at [developer.intuit.com](https://developer.intuit.com)
2. **Set up OAuth flow** for customer authorization
3. **Configure webhook endpoints** for order sync
4. **Set up chart of accounts** for proper categorization

## 📊 Analytics & Monitoring

### Built-in Analytics
- Order tracking and reporting
- Inventory management
- Customer analytics
- Revenue reporting

### Integration Analytics
- Stripe payment analytics
- QuickBooks financial reports
- Social media performance metrics

### AWS Monitoring
- CloudWatch logs and metrics
- API Gateway monitoring
- Lambda performance tracking
- DynamoDB usage monitoring

## 🔒 Security

### Data Protection
- SSL/TLS encryption for all communications
- Secure API key management
- PCI DSS compliance through Stripe
- GDPR-compliant data handling

### AWS Security
- IAM roles with least privilege access
- VPC configuration for Lambda functions
- CloudTrail audit logging
- GuardDuty threat detection

## 🧪 Testing

### Frontend Testing
```bash
npm run test              # Run unit tests
npm run test:e2e         # Run end-to-end tests
npm run test:coverage    # Generate coverage report
```

### API Testing
```bash
# Test product endpoints
curl https://your-api-gateway-url.amazonaws.com/prod/products

# Test with filters
curl "https://your-api-gateway-url.amazonaws.com/prod/products?category=putters&brand=Scotty%20Cameron"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write tests for new features
- Update documentation as needed
- Follow the existing code structure

## 📝 API Documentation

### Products API

#### Get All Products
```http
GET /api/products
Query Parameters:
- category: Filter by product category
- brand: Filter by brand
- condition: Filter by condition
- priceMin/priceMax: Price range filter
- featured: Show only featured products
- page: Page number for pagination
- limit: Items per page
```

#### Get Single Product
```http
GET /api/products/{id}
```

### Orders API

#### Create Order
```http
POST /api/orders
Body: {
  "items": [...],
  "shippingAddress": {...},
  "billingAddress": {...},
  "email": "customer@example.com"
}
```

### Webhooks

#### Stripe Webhook
```http
POST /api/stripe-webhook
Headers:
- stripe-signature: Webhook signature
```

#### QuickBooks Webhook
```http
POST /api/quickbooks-webhook
```

## 🔄 Social Media Integration

See [Social Media Integration Guide](./docs/social-media-integration.md) for detailed setup instructions.

### Supported Platforms
- Instagram Shopping
- Sideline Swap
- Facebook Marketplace
- Pinterest Shopping
- TikTok Shopping

## 📞 Support

### Documentation
- [AWS Deployment Guide](./deployment/aws-deployment.md)
- [Social Media Integration](./docs/social-media-integration.md)
- [API Documentation](#api-documentation)

### Getting Help
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting guide

### Contact
- Email: support@kingcovygolfclub.com
- Website: [kingcovygolfclub.com](https://kingcovygolfclub.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Powered by [AWS](https://aws.amazon.com/)
- Payments by [Stripe](https://stripe.com/)
- Accounting by [QuickBooks](https://quickbooks.intuit.com/)

---

**King Covy Golf Club** - Premium Golf Equipment & Collectibles 🏌️‍♂️
