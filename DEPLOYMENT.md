# King Covy Golf Club - Deployment Guide

This guide covers the complete deployment of the King Covy Golf Club e-commerce platform on AWS.

## 🏗️ Architecture Overview

The platform uses a modern, serverless architecture:

- **Frontend**: Next.js deployed on AWS Amplify
- **Backend**: AWS Lambda functions with API Gateway
- **Database**: DynamoDB for products, orders, and customers
- **Assets**: S3 bucket with CloudFront CDN
- **Payments**: Stripe integration (configured separately)

## 📋 Prerequisites

Before deploying, ensure you have:

- AWS CLI installed and configured
- Node.js 18+ and npm
- Git
- AWS account with appropriate permissions

## 🚀 Quick Deployment

For a complete deployment, run:

```bash
./scripts/deploy-all.sh
```

This script will:
1. Set up environment variables
2. Create S3 bucket for assets
3. Configure CloudFront distribution
4. Deploy Lambda functions
5. Create DynamoDB tables
6. Seed the database
7. Set up API Gateway
8. Build and deploy the frontend

## 🔧 Manual Deployment Steps

### 1. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit with your actual values
nano .env

# Or use the setup script
./scripts/setup-env.sh
```

### 2. S3 Bucket Setup

```bash
./scripts/setup-s3.sh
```

This creates:
- S3 bucket: `king-covy-assets`
- Folder structure for organized assets
- Public read access for assets
- CORS configuration for web access
- Lifecycle policies for cost optimization

### 3. CloudFront Distribution

```bash
./scripts/setup-cloudfront.sh
```

This creates:
- CloudFront distribution for global CDN
- Optimized caching rules for images
- HTTPS redirect
- Cache invalidation script

### 4. Backend Infrastructure

```bash
# Deploy Lambda functions
./deploy-lambda.sh

# Create DynamoDB tables
./create-tables.sh

# Seed with sample data
node seed-products.js

# Set up API Gateway
./setup-api-gateway.sh
```

### 5. Frontend Deployment

```bash
# Build the application
npm run build

# Deploy to Amplify (via git push)
git add .
git commit -m "Deploy: $(date)"
git push
```

## 📁 Project Structure

```
king-covy-frontend/
├── src/                          # Frontend source code
│   ├── app/                      # Next.js app router pages
│   ├── components/               # React components
│   ├── context/                  # React context providers
│   ├── services/                 # API service layer
│   └── types/                    # TypeScript type definitions
├── backend/                      # Backend Lambda functions
│   └── lambda/                   # Individual Lambda functions
├── scripts/                      # Deployment and setup scripts
├── public/                       # Static assets
└── docs/                         # Documentation
```

## 🔑 Environment Variables

### Frontend (.env)
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/prod
NEXT_PUBLIC_S3_BASE_URL=https://your-s3-bucket.s3.amazonaws.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Backend (Lambda functions)
```bash
PRODUCTS_TABLE=king-covy-products
ORDERS_TABLE=king-covy-orders
CUSTOMERS_TABLE=king-covy-customers
INVENTORY_TABLE=king-covy-inventory
```

## 🗄️ Database Schema

### Products Table
- **Primary Key**: `id` (String)
- **GSI**: `category-index`, `brand-index`
- **Attributes**: name, price, description, images, specifications, etc.

### Orders Table
- **Primary Key**: `id` (String)
- **GSI**: `customerEmail-index`, `status-index`
- **Attributes**: customer info, items, total, status, timestamps

### Customers Table
- **Primary Key**: `id` (String)
- **GSI**: `email-index`
- **Attributes**: name, email, address, preferences

## 🌐 API Endpoints

### Products
- `GET /products` - List products with filtering and pagination
- `GET /products/{id}` - Get single product details

### Orders (Future)
- `POST /orders` - Create new order
- `GET /orders/{id}` - Get order details
- `PUT /orders/{id}` - Update order status

## 🖼️ Asset Management

### S3 Structure
```
king-covy-assets/
├── products/
│   ├── images/          # Full-size product images
│   └── thumbnails/      # Thumbnail images
├── brands/              # Brand logos
├── categories/          # Category images
└── uploads/             # User uploads
```

### CloudFront Caching
- **Product Images**: 30 days cache
- **Thumbnails**: 30 days cache
- **General Assets**: 1 day cache

## 🔄 Cache Management

### Invalidate CloudFront Cache
```bash
./scripts/invalidate-cache.sh
```

### Invalidate Specific Path
```bash
./scripts/invalidate-cache.sh "products/images/*"
```

## 📊 Monitoring and Logs

### View Lambda Logs
```bash
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/king-covy"
```

### View API Gateway Logs
```bash
aws logs describe-log-groups --log-group-name-prefix "/aws/apigateway"
```

## 🛠️ Development

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Testing API Locally
```bash
# Test products endpoint
curl "https://8pubh8jl00.execute-api.us-east-1.amazonaws.com/prod/products?limit=3"

# Test single product
curl "https://8pubh8jl00.execute-api.us-east-1.amazonaws.com/prod/products/prod_001"
```

## 🔒 Security Considerations

### IAM Permissions
- Lambda functions have minimal required DynamoDB permissions
- S3 bucket has public read access only for assets
- API Gateway uses IAM authentication for sensitive endpoints

### Environment Variables
- Never commit `.env` files to version control
- Use AWS Systems Manager Parameter Store for production secrets
- Rotate API keys regularly

## 💰 Cost Optimization

### DynamoDB
- Uses on-demand billing
- Consider provisioned capacity for predictable workloads
- Enable point-in-time recovery for production

### S3
- Lifecycle policies automatically transition old versions
- CloudFront reduces S3 transfer costs
- Use appropriate storage classes

### Lambda
- Functions use minimal memory allocation
- Consider reserved concurrency for production
- Monitor and optimize cold start times

## 🚨 Troubleshooting

### Common Issues

#### API Gateway 404 Errors
```bash
# Check if Lambda functions are deployed
aws lambda list-functions --query 'Functions[?contains(FunctionName, `king-covy`)].FunctionName'

# Check API Gateway resources
aws apigateway get-resources --rest-api-id YOUR_API_ID
```

#### DynamoDB Access Issues
```bash
# Check table permissions
aws dynamodb describe-table --table-name king-covy-products

# Test Lambda function permissions
aws lambda invoke --function-name king-covy-get-products response.json
```

#### CloudFront Not Updating
```bash
# Create invalidation
./scripts/invalidate-cache.sh "/*"

# Check distribution status
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

## 📞 Support

For deployment issues:
1. Check AWS CloudWatch logs
2. Verify IAM permissions
3. Test individual components
4. Review this documentation

## 🔄 Updates and Maintenance

### Regular Tasks
- Monitor CloudWatch metrics
- Update dependencies monthly
- Review and rotate API keys
- Backup DynamoDB tables
- Update CloudFront distributions

### Scaling Considerations
- Monitor DynamoDB throttling
- Consider Lambda concurrency limits
- Plan for increased CloudFront costs
- Monitor S3 storage usage

---

**Last Updated**: $(date)
**Version**: 1.0.0
