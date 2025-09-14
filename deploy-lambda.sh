#!/bin/bash

# Deploy Lambda functions for King Covy Golf Club
set -e

echo "🚀 Deploying Lambda functions to AWS..."

# Configuration
REGION="us-east-1"
ROLE_NAME="king-covy-lambda-role"
FUNCTION_NAME_PREFIX="king-covy"

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

# Create IAM role for Lambda if it doesn't exist
ROLE_ARN="arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/$ROLE_NAME"

if ! aws iam get-role --role-name $ROLE_NAME > /dev/null 2>&1; then
    print_warning "Creating IAM role for Lambda functions..."
    
    # Create trust policy
    cat > trust-policy.json << EOF
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

    # Create the role
    aws iam create-role \
        --role-name $ROLE_NAME \
        --assume-role-policy-document file://trust-policy.json \
        --description "Role for King Covy Lambda functions"
    
    # Attach basic execution policy
    aws iam attach-role-policy \
        --role-name $ROLE_NAME \
        --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    
    # Attach DynamoDB policy
    cat > dynamodb-policy.json << EOF
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
      "Resource": "*"
    }
  ]
}
EOF

    aws iam put-role-policy \
        --role-name $ROLE_NAME \
        --policy-name DynamoDBAccess \
        --policy-document file://dynamodb-policy.json
    
    print_status "IAM role created successfully"
    
    # Clean up policy files
    rm trust-policy.json dynamodb-policy.json
    
    # Wait for role to be available
    print_warning "Waiting for IAM role to be available..."
    sleep 10
else
    print_status "IAM role already exists"
fi

# Function to deploy a Lambda function
deploy_function() {
    local FUNCTION_NAME=$1
    local SOURCE_DIR=$2
    local HANDLER=$3
    
    print_warning "Deploying $FUNCTION_NAME..."
    
    # Create deployment package
    cd $SOURCE_DIR
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
            --role $ROLE_ARN \
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

# Deploy functions
deploy_function "king-covy-get-products" "backend/lambda/get-products" "index.handler"
deploy_function "king-covy-get-product" "backend/lambda/get-product" "index.handler"
deploy_function "king-covy-create-order" "backend/lambda/create-order" "index.handler"
deploy_function "king-covy-get-order" "backend/lambda/get-order" "index.handler"
deploy_function "king-covy-get-customer-orders" "backend/lambda/get-customer-orders" "index.handler"
deploy_function "king-covy-update-order-status" "backend/lambda/update-order-status" "index.handler"

print_status "All Lambda functions deployed successfully!"

# Display function information
echo ""
echo "📋 Deployed Functions:"
echo "  • king-covy-get-products"
echo "  • king-covy-get-product"
echo "  • king-covy-create-order"
echo "  • king-covy-get-order"
echo "  • king-covy-get-customer-orders"
echo "  • king-covy-update-order-status"
echo ""
echo "🔗 Next steps:"
echo "  1. Set up API Gateway to expose these functions"
echo "  2. Create DynamoDB tables"
echo "  3. Test the endpoints"
echo ""
