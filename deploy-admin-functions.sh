#!/bin/bash

# Deploy Admin Lambda Functions
echo "🚀 Deploying Admin Lambda Functions..."

# Function to deploy a Lambda function
deploy_function() {
    local function_name=$1
    local function_path=$2
    local handler=$3
    
    echo "📦 Installing dependencies for $function_name..."
    cd "$function_path"
    npm install --production
    zip -r function.zip . -x "*.git*" "*.DS_Store*"
    
    echo "🚀 Deploying $function_name..."
    aws lambda update-function-code \
        --function-name "$function_name" \
        --zip-file fileb://function.zip
    
    if [ $? -eq 0 ]; then
        echo "✅ $function_name deployed successfully"
    else
        echo "❌ Failed to deploy $function_name"
        # Try to create the function if it doesn't exist
        echo "🔄 Attempting to create $function_name..."
        aws lambda create-function \
            --function-name "$function_name" \
            --runtime nodejs18.x \
            --role arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/lambda-execution-role \
            --handler "$handler" \
            --zip-file fileb://function.zip \
            --environment Variables="$(cat ../../../env-vars.json)"
        
        if [ $? -eq 0 ]; then
            echo "✅ $function_name created and deployed successfully"
        else
            echo "❌ Failed to create $function_name"
        fi
    fi
    
    rm function.zip
    cd - > /dev/null
}

# Deploy admin functions
deploy_function "king-covy-admin-create-product" "backend/lambda/admin/create-product" "index.handler"
deploy_function "king-covy-admin-update-product" "backend/lambda/admin/update-product" "index.handler"
deploy_function "king-covy-admin-delete-product" "backend/lambda/admin/delete-product" "index.handler"
deploy_function "king-covy-admin-manage-inventory" "backend/lambda/admin/manage-inventory" "index.handler"

echo "🎉 Admin Lambda functions deployment complete!"
