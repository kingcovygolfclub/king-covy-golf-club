#!/bin/bash

# Deploy order and customer management Lambda functions

set -e

echo "🚀 Deploying Order and Customer Management Lambda Functions..."

# Get AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "📋 AWS Account ID: $ACCOUNT_ID"

# Function list
functions=(
    "backend/lambda/orders/get-orders:king-covy-get-orders"
    "backend/lambda/customers/get-customers:king-covy-get-customers"
    "backend/lambda/admin/dashboard-stats:king-covy-dashboard-stats"
)

# Deploy each function
for function_config in "${functions[@]}"; do
    IFS=':' read -r function_path function_name <<< "$function_config"
    echo "📦 Deploying $function_name from $function_path..."
    
    # Change to function directory
    cd "$function_path"
    
    # Install dependencies
    echo "📥 Installing dependencies..."
    npm install --production
    
    # Create deployment package
    echo "🗜️ Creating deployment package..."
    zip -r function.zip . -x "*.zip" "node_modules/.cache/*"
    
    # Check if function exists
    if aws lambda get-function --function-name "$function_name" >/dev/null 2>&1; then
        echo "🔄 Updating existing function: $function_name"
        aws lambda update-function-code \
            --function-name "$function_name" \
            --zip-file fileb://function.zip
    else
        echo "🆕 Creating new function: $function_name"
        
        aws lambda create-function \
            --function-name "$function_name" \
            --runtime nodejs18.x \
            --role arn:aws:iam::${ACCOUNT_ID}:role/lambda-execution-role \
            --handler "index.handler" \
            --zip-file fileb://function.zip \
            --environment Variables='{PRODUCTS_TABLE=king-covy-products,ORDERS_TABLE=king-covy-orders,CUSTOMERS_TABLE=king-covy-customers}'
    fi
    
    # Clean up
    rm function.zip
    
    # Return to project root
    cd - > /dev/null
    
    echo "✅ Successfully deployed $function_name"
done

echo "🎉 All order and customer management functions deployed successfully!"
