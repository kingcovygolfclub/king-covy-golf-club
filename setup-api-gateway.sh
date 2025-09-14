#!/bin/bash

# Set up API Gateway for King Covy Golf Club Lambda functions
set -e

echo "🚀 Setting up API Gateway for King Covy Golf Club..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    print_error "AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

print_status "AWS CLI is configured"

# Configuration
API_NAME="king-covy-api"
REGION="us-east-1"
STAGE="prod"

# Create API Gateway
print_warning "Creating API Gateway: $API_NAME"

API_ID=$(aws apigateway create-rest-api \
    --name $API_NAME \
    --description "King Covy Golf Club API" \
    --endpoint-configuration types=REGIONAL \
    --query 'id' \
    --output text)

if [ -z "$API_ID" ]; then
    print_error "Failed to create API Gateway"
    exit 1
fi

print_status "API Gateway created with ID: $API_ID"

# Get root resource ID
ROOT_RESOURCE_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --query 'items[0].id' \
    --output text)

print_status "Root resource ID: $ROOT_RESOURCE_ID"

# Create /products resource
print_warning "Creating /products resource..."
PRODUCTS_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $ROOT_RESOURCE_ID \
    --path-part "products" \
    --query 'id' \
    --output text)

print_status "Products resource created with ID: $PRODUCTS_RESOURCE_ID"

# Create /products/{id} resource
print_warning "Creating /products/{id} resource..."
PRODUCT_ID_RESOURCE_ID=$(aws apigateway create-resource \
    --rest-api-id $API_ID \
    --parent-id $PRODUCTS_RESOURCE_ID \
    --path-part "{id}" \
    --query 'id' \
    --output text)

print_status "Product ID resource created with ID: $PRODUCT_ID_RESOURCE_ID"

# Create GET method for /products
print_warning "Creating GET method for /products..."
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $PRODUCTS_RESOURCE_ID \
    --http-method GET \
    --authorization-type NONE \
    --request-parameters method.request.querystring.category=false,method.request.querystring.brand=false,method.request.querystring.condition=false,method.request.querystring.priceMin=false,method.request.querystring.priceMax=false,method.request.querystring.inStock=false,method.request.querystring.featured=false,method.request.querystring.page=false,method.request.querystring.limit=false,method.request.querystring.sortBy=false,method.request.querystring.lastEvaluatedKey=false

print_status "GET method created for /products"

# Create GET method for /products/{id}
print_warning "Creating GET method for /products/{id}..."
aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $PRODUCT_ID_RESOURCE_ID \
    --http-method GET \
    --authorization-type NONE \
    --request-parameters method.request.path.id=true

print_status "GET method created for /products/{id}"

# Set up Lambda integration for /products
print_warning "Setting up Lambda integration for /products..."
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $PRODUCTS_RESOURCE_ID \
    --http-method GET \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$(aws sts get-caller-identity --query Account --output text):function:king-covy-get-products/invocations"

print_status "Lambda integration set up for /products"

# Set up Lambda integration for /products/{id}
print_warning "Setting up Lambda integration for /products/{id}..."
aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $PRODUCT_ID_RESOURCE_ID \
    --http-method GET \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/arn:aws:lambda:$REGION:$(aws sts get-caller-identity --query Account --output text):function:king-covy-get-product/invocations"

print_status "Lambda integration set up for /products/{id}"

# Add Lambda permissions for API Gateway
print_warning "Adding Lambda permissions for API Gateway..."

# Get account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Add permission for get-products function
aws lambda add-permission \
    --function-name king-covy-get-products \
    --statement-id apigateway-get-products \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/*" \
    2>/dev/null || print_warning "Permission already exists for get-products"

# Add permission for get-product function
aws lambda add-permission \
    --function-name king-covy-get-product \
    --statement-id apigateway-get-product \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:$ACCOUNT_ID:$API_ID/*/*" \
    2>/dev/null || print_warning "Permission already exists for get-product"

print_status "Lambda permissions added"

# Deploy the API
print_warning "Deploying API to stage: $STAGE..."
aws apigateway create-deployment \
    --rest-api-id $API_ID \
    --stage-name $STAGE \
    --description "Initial deployment"

print_status "API deployed to stage: $STAGE"

# Get the API URL
API_URL="https://$API_ID.execute-api.$REGION.amazonaws.com/$STAGE"

print_status "API Gateway setup completed successfully!"
echo ""
echo "📋 API Information:"
echo "  • API ID: $API_ID"
echo "  • API URL: $API_URL"
echo "  • Stage: $STAGE"
echo ""
echo "🔗 Available Endpoints:"
echo "  • GET $API_URL/products - Get all products (with filters)"
echo "  • GET $API_URL/products/{id} - Get single product"
echo ""
echo "📝 Query Parameters for /products:"
echo "  • category, brand, condition, priceMin, priceMax"
echo "  • inStock, featured, page, limit, sortBy"
echo "  • lastEvaluatedKey (for pagination)"
echo ""
echo "🔗 Next steps:"
echo "  1. Update frontend to use real API endpoints"
echo "  2. Seed the products table with sample data"
echo "  3. Test the API endpoints"
echo ""

# Save API information to file
echo "API_ID=$API_ID" > .env.api
echo "API_URL=$API_URL" >> .env.api
echo "REGION=$REGION" >> .env.api
echo "STAGE=$STAGE" >> .env.api

print_status "API configuration saved to .env.api"
