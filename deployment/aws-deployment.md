# AWS Deployment Guide for King Covy Golf Club

This guide provides step-by-step instructions for deploying the King Covy Golf Club e-commerce platform to AWS using a serverless architecture.

## Prerequisites

- AWS CLI installed and configured
- Node.js 18+ installed
- Docker installed (for Lambda deployment)
- Domain name registered (optional, for Route 53)

## 1. Frontend Deployment (AWS Amplify)

### Step 1: Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
amplify configure
```

### Step 2: Initialize Amplify Project
```bash
cd /Users/newhorizon/King-Covy-frontend
amplify init
# Follow prompts:
# - Project name: king-covy-golf-club
# - Environment: dev
# - Default editor: Visual Studio Code
# - Type: JavaScript
# - Framework: React
# - Source directory: src
# - Distribution directory: .next
# - Build command: npm run build
# - Start command: npm run start
```

### Step 3: Add Hosting
```bash
amplify add hosting
# Select: Amazon CloudFront and S3
# Environment: Production
```

### Step 4: Configure Environment Variables
```bash
amplify env add
# Create production environment
amplify env checkout prod
```

Add environment variables to Amplify console or use CLI:
```bash
amplify env add envvars
```

### Step 5: Deploy Frontend
```bash
amplify publish
```

## 2. Backend Deployment (Lambda + API Gateway + DynamoDB)

### Step 1: Create DynamoDB Tables

```bash
# Create products table
aws dynamodb create-table \
    --table-name king-covy-products \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=category,AttributeType=S \
        AttributeName=brand,AttributeType=S \
        AttributeName=featured,AttributeType=BOOL \
        AttributeName=createdAt,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=category-index,KeySchema='[{AttributeName=category,KeyType=HASH},{AttributeName=createdAt,KeyType=RANGE}]',Projection='{ProjectionType=ALL}',BillingMode=PAY_PER_REQUEST \
        IndexName=brand-index,KeySchema='[{AttributeName=brand,KeyType=HASH},{AttributeName=createdAt,KeyType=RANGE}]',Projection='{ProjectionType=ALL}',BillingMode=PAY_PER_REQUEST \
        IndexName=featured-index,KeySchema='[{AttributeName=featured,KeyType=HASH},{AttributeName=createdAt,KeyType=RANGE}]',Projection='{ProjectionType=ALL}',BillingMode=PAY_PER_REQUEST \
    --billing-mode PAY_PER_REQUEST

# Create inventory table
aws dynamodb create-table \
    --table-name king-covy-inventory \
    --attribute-definitions \
        AttributeName=productId,AttributeType=S \
        AttributeName=lastUpdated,AttributeType=S \
    --key-schema \
        AttributeName=productId,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=last-updated-index,KeySchema='[{AttributeName=lastUpdated,KeyType=HASH}]',Projection='{ProjectionType=ALL}',BillingMode=PAY_PER_REQUEST \
    --billing-mode PAY_PER_REQUEST

# Create orders table
aws dynamodb create-table \
    --table-name king-covy-orders \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=customerEmail,AttributeType=S \
        AttributeName=status,AttributeType=S \
        AttributeName=createdAt,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=customer-email-index,KeySchema='[{AttributeName=customerEmail,KeyType=HASH},{AttributeName=createdAt,KeyType=RANGE}]',Projection='{ProjectionType=ALL}',BillingMode=PAY_PER_REQUEST \
        IndexName=status-index,KeySchema='[{AttributeName=status,KeyType=HASH},{AttributeName=createdAt,KeyType=RANGE}]',Projection='{ProjectionType=ALL}',BillingMode=PAY_PER_REQUEST \
    --billing-mode PAY_PER_REQUEST

# Create customers table
aws dynamodb create-table \
    --table-name king-covy-customers \
    --attribute-definitions \
        AttributeName=id,AttributeType=S \
        AttributeName=email,AttributeType=S \
    --key-schema \
        AttributeName=id,KeyType=HASH \
    --global-secondary-indexes \
        IndexName=email-index,KeySchema='[{AttributeName=email,KeyType=HASH}]',Projection='{ProjectionType=ALL}',BillingMode=PAY_PER_REQUEST \
    --billing-mode PAY_PER_REQUEST
```

### Step 2: Create IAM Role for Lambda

```bash
# Create trust policy
cat > lambda-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create IAM role
aws iam create-role \
    --role-name king-covy-lambda-role \
    --assume-role-policy-document file://lambda-trust-policy.json

# Create policy for DynamoDB access
cat > lambda-dynamodb-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:UpdateItem",
                "dynamodb:DeleteItem",
                "dynamodb:Query",
                "dynamodb:Scan"
            ],
            "Resource": [
                "arn:aws:dynamodb:*:*:table/king-covy-*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:*:*:*"
        }
    ]
}
EOF

# Attach policy to role
aws iam put-role-policy \
    --role-name king-covy-lambda-role \
    --policy-name DynamoDBAccess \
    --policy-document file://lambda-dynamodb-policy.json
```

### Step 3: Deploy Lambda Functions

```bash
# Install serverless framework
npm install -g serverless
npm install --save-dev serverless-offline

# Create serverless.yml
cat > serverless.yml << EOF
service: king-covy-backend

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  stage: prod
  environment:
    PRODUCTS_TABLE: king-covy-products
    INVENTORY_TABLE: king-covy-inventory
    ORDERS_TABLE: king-covy-orders
    CUSTOMERS_TABLE: king-covy-customers
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - dynamodb:Query
            - dynamodb:Scan
            - dynamodb:GetItem
            - dynamodb:PutItem
            - dynamodb:UpdateItem
            - dynamodb:DeleteItem
          Resource:
            - "arn:aws:dynamodb:\${opt:region, self:provider.region}:*:table/king-covy-*"

functions:
  getProducts:
    handler: backend/lambda/get-products/index.handler
    events:
      - http:
          path: /products
          method: get
          cors: true
  
  getProduct:
    handler: backend/lambda/get-product/index.handler
    events:
      - http:
          path: /products/{id}
          method: get
          cors: true

plugins:
  - serverless-offline
EOF

# Deploy functions
serverless deploy
```

### Step 4: Create API Gateway (if not using serverless)

```bash
# Create API Gateway
aws apigateway create-rest-api \
    --name king-covy-api \
    --description "King Covy Golf Club API"

# Get API ID
API_ID=$(aws apigateway get-rest-apis \
    --query 'items[?name==`king-covy-api`].id' \
    --output text)

# Create deployment
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name prod
```

## 3. S3 Bucket Setup for Assets

```bash
# Create S3 bucket for assets
aws s3 mb s3://king-covy-assets

# Configure bucket for static website hosting
aws s3 website s3://king-covy-assets \
    --index-document index.html \
    --error-document error.html

# Create bucket policy for public read access
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::king-covy-assets/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy \
    --bucket king-covy-assets \
    --policy file://bucket-policy.json
```

## 4. CloudFront Distribution

```bash
# Create CloudFront distribution configuration
cat > cloudfront-config.json << EOF
{
    "CallerReference": "king-covy-distribution-$(date +%s)",
    "Comment": "King Covy Golf Club Assets Distribution",
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-king-covy-assets",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            }
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000
    },
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-king-covy-assets",
                "DomainName": "king-covy-assets.s3.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                }
            }
        ]
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100"
}
EOF

# Create CloudFront distribution
aws cloudfront create-distribution \
    --distribution-config file://cloudfront-config.json
```

## 5. Route 53 Setup (Optional)

```bash
# Create hosted zone for your domain
aws route53 create-hosted-zone \
    --name kingcovygolfclub.com \
    --caller-reference $(date +%s)

# Get hosted zone ID
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones \
    --query 'HostedZones[?Name==`kingcovygolfclub.com.`].Id' \
    --output text | cut -d'/' -f3)

# Create A record pointing to CloudFront
cat > dns-record.json << EOF
{
    "Changes": [
        {
            "Action": "CREATE",
            "ResourceRecordSet": {
                "Name": "kingcovygolfclub.com",
                "Type": "A",
                "AliasTarget": {
                    "DNSName": "your-cloudfront-domain.cloudfront.net",
                    "EvaluateTargetHealth": false,
                    "HostedZoneId": "Z2FDTNDATAQYW2"
                }
            }
        }
    ]
}
EOF

aws route53 change-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch file://dns-record.json
```

## 6. Environment Configuration

### Update .env files with actual AWS values:

```bash
# Frontend .env.local
NEXT_PUBLIC_API_URL=https://your-api-gateway-url.amazonaws.com/prod
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
NEXT_PUBLIC_CLOUDFRONT_DOMAIN=your-cloudfront-domain.cloudfront.net

# Backend environment variables
AWS_REGION=us-east-1
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
QB_CLIENT_ID=your_quickbooks_client_id
QB_CLIENT_SECRET=your_quickbooks_client_secret
QB_COMPANY_ID=your_quickbooks_company_id
```

## 7. Data Population

```bash
# Upload sample products to DynamoDB
aws dynamodb put-item \
    --table-name king-covy-products \
    --item file://sample-products.json

# Update inventory
aws dynamodb put-item \
    --table-name king-covy-inventory \
    --item file://sample-inventory.json
```

## 8. Monitoring and Logging

```bash
# Create CloudWatch log groups
aws logs create-log-group \
    --log-group-name /aws/lambda/king-covy-get-products

aws logs create-log-group \
    --log-group-name /aws/lambda/king-covy-get-product

# Set up CloudWatch alarms
aws cloudwatch put-metric-alarm \
    --alarm-name "King-Covy-API-Errors" \
    --alarm-description "API Gateway 4xx/5xx errors" \
    --metric-name 4XXError \
    --namespace AWS/ApiGateway \
    --statistic Sum \
    --period 300 \
    --threshold 10 \
    --comparison-operator GreaterThanThreshold
```

## 9. Security Best Practices

### Enable AWS Config
```bash
aws configservice put-configuration-recorder \
    --configuration-recorder name=default,roleARN=arn:aws:iam::ACCOUNT:role/aws-service-role/config.amazonaws.com/AWSServiceRoleForConfig
```

### Set up AWS GuardDuty
```bash
aws guardduty create-detector \
    --enable
```

### Enable CloudTrail
```bash
aws cloudtrail create-trail \
    --name king-covy-audit-trail \
    --s3-bucket-name king-covy-audit-logs
```

## 10. Cost Optimization

### Set up billing alerts
```bash
aws cloudwatch put-metric-alarm \
    --alarm-name "King-Covy-Monthly-Cost" \
    --alarm-description "Monthly AWS costs" \
    --metric-name EstimatedCharges \
    --namespace AWS/Billing \
    --statistic Maximum \
    --period 86400 \
    --threshold 500 \
    --comparison-operator GreaterThanThreshold
```

## Deployment Checklist

- [ ] DynamoDB tables created
- [ ] Lambda functions deployed
- [ ] API Gateway configured
- [ ] S3 bucket for assets created
- [ ] CloudFront distribution deployed
- [ ] Route 53 configured (if using custom domain)
- [ ] Environment variables set
- [ ] Sample data uploaded
- [ ] Monitoring and logging configured
- [ ] Security measures implemented
- [ ] Cost monitoring set up

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure API Gateway has CORS enabled
2. **DynamoDB Permissions**: Check IAM role permissions
3. **CloudFront Cache**: Clear cache after updates
4. **Lambda Timeout**: Increase timeout for large operations
5. **API Gateway Limits**: Monitor throttling and adjust limits

### Useful Commands:

```bash
# Check Lambda logs
aws logs describe-log-streams --log-group-name /aws/lambda/king-covy-get-products

# Test API endpoint
curl -X GET "https://your-api-gateway-url.amazonaws.com/prod/products"

# Check DynamoDB table status
aws dynamodb describe-table --table-name king-covy-products
```
