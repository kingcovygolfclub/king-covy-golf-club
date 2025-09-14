#!/bin/bash

# Deploy order management Lambda functions
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  Deploying Order Functions${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Function to deploy a Lambda function
deploy_function() {
    local FUNCTION_NAME=$1
    local SOURCE_DIR=$2
    local HANDLER=$3
    
    print_warning "Deploying $FUNCTION_NAME..."
    
    # Create deployment package
    cd $SOURCE_DIR
    npm install
    zip -r ../${FUNCTION_NAME}.zip . > /dev/null
    cd ..
    
    # Check if function exists
    if aws lambda get-function --function-name $FUNCTION_NAME > /dev/null 2>&1; then
        # Update existing function
        aws lambda update-function-code \
            --function-name $FUNCTION_NAME \
            --zip-file fileb://${FUNCTION_NAME}.zip
        
        print_status "$FUNCTION_NAME updated successfully"
    else
        # Create new function
        aws lambda create-function \
            --function-name $FUNCTION_NAME \
            --runtime nodejs18.x \
            --role arn:aws:iam::101737575156:role/king-covy-lambda-role \
            --handler $HANDLER \
            --zip-file fileb://${FUNCTION_NAME}.zip \
            --description "King Covy Golf Club - $FUNCTION_NAME" \
            --timeout 30 \
            --memory-size 256
        
        print_status "$FUNCTION_NAME created successfully"
    fi
    
    # Set environment variables
    aws lambda update-function-configuration \
        --function-name $FUNCTION_NAME \
        --environment file://../../env-vars.json
    
    # Clean up zip file
    rm ${FUNCTION_NAME}.zip
}

print_header

# Deploy order functions
deploy_function "king-covy-create-order" "backend/lambda/create-order" "index.handler"
deploy_function "king-covy-get-order" "backend/lambda/get-order" "index.handler"
deploy_function "king-covy-get-customer-orders" "backend/lambda/get-customer-orders" "index.handler"
deploy_function "king-covy-update-order-status" "backend/lambda/update-order-status" "index.handler"

print_status "All order management functions deployed successfully!"

echo ""
echo "📋 Deployed Order Functions:"
echo "  • king-covy-create-order"
echo "  • king-covy-get-order"
echo "  • king-covy-get-customer-orders"
echo "  • king-covy-update-order-status"
echo ""
echo "🔗 Next steps:"
echo "  1. Update API Gateway to include order endpoints"
echo "  2. Test the order creation flow"
echo "  3. Build frontend order management interface"
echo ""
