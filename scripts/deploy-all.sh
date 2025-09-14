#!/bin/bash

# King Covy Golf Club - Complete Deployment Script
# This script deploys the entire e-commerce platform

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  King Covy Complete Deployment${NC}"
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

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed"
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check git
    if ! command -v git &> /dev/null; then
        print_error "git is not installed"
        exit 1
    fi
    
    print_status "All prerequisites are installed"
}

# Setup environment
setup_environment() {
    print_info "Setting up environment..."
    
    if [ -f "scripts/setup-env.sh" ]; then
        ./scripts/setup-env.sh
    else
        print_warning "Environment setup script not found"
    fi
}

# Setup S3
setup_s3() {
    print_info "Setting up S3 bucket..."
    
    if [ -f "scripts/setup-s3.sh" ]; then
        ./scripts/setup-s3.sh
    else
        print_warning "S3 setup script not found"
    fi
}

# Setup CloudFront
setup_cloudfront() {
    print_info "Setting up CloudFront distribution..."
    
    if [ -f "scripts/setup-cloudfront.sh" ]; then
        ./scripts/setup-cloudfront.sh
    else
        print_warning "CloudFront setup script not found"
    fi
}

# Deploy Lambda functions
deploy_lambda_functions() {
    print_info "Deploying Lambda functions..."
    
    if [ -f "deploy-lambda.sh" ]; then
        ./deploy-lambda.sh
    else
        print_warning "Lambda deployment script not found"
    fi
}

# Setup DynamoDB tables
setup_dynamodb() {
    print_info "Setting up DynamoDB tables..."
    
    if [ -f "create-tables.sh" ]; then
        ./create-tables.sh
    else
        print_warning "DynamoDB setup script not found"
    fi
}

# Seed database
seed_database() {
    print_info "Seeding database with sample data..."
    
    if [ -f "seed-products.js" ]; then
        node seed-products.js
    else
        print_warning "Database seeding script not found"
    fi
}

# Setup API Gateway
setup_api_gateway() {
    print_info "Setting up API Gateway..."
    
    if [ -f "setup-api-gateway.sh" ]; then
        ./setup-api-gateway.sh
    else
        print_warning "API Gateway setup script not found"
    fi
}

# Build frontend
build_frontend() {
    print_info "Building frontend application..."
    
    # Install dependencies
    npm install
    
    # Build the application
    npm run build
    
    print_status "Frontend build completed"
}

# Deploy frontend to Amplify
deploy_frontend() {
    print_info "Deploying frontend to AWS Amplify..."
    
    # Commit and push changes
    git add .
    git commit -m "Deploy: $(date)" || true
    git push
    
    print_status "Frontend deployment initiated"
}

# Test deployment
test_deployment() {
    print_info "Testing deployment..."
    
    # Wait a moment for deployment
    sleep 10
    
    # Test API endpoints
    API_BASE_URL=$(grep NEXT_PUBLIC_API_BASE_URL .env.api 2>/dev/null | cut -d '=' -f2 || echo "https://8pubh8jl00.execute-api.us-east-1.amazonaws.com/prod")
    
    print_info "Testing API endpoint: $API_BASE_URL/products"
    
    if curl -s "$API_BASE_URL/products?limit=1" | grep -q "success"; then
        print_status "API endpoint is working"
    else
        print_warning "API endpoint test failed"
    fi
}

# Show deployment summary
show_summary() {
    print_header
    print_status "Deployment completed!"
    
    echo ""
    print_info "Your King Covy Golf Club e-commerce platform is now deployed:"
    echo ""
    
    # Get deployment URLs
    API_BASE_URL=$(grep NEXT_PUBLIC_API_BASE_URL .env.api 2>/dev/null | cut -d '=' -f2 || echo "https://8pubh8jl00.execute-api.us-east-1.amazonaws.com/prod")
    S3_BASE_URL=$(grep NEXT_PUBLIC_S3_BASE_URL env.production 2>/dev/null | cut -d '=' -f2 || echo "https://king-covy-assets.s3.us-east-1.amazonaws.com")
    
    echo "🔗 API Endpoint: $API_BASE_URL"
    echo "🖼️  Assets URL: $S3_BASE_URL"
    echo "🌐 Frontend: Check your AWS Amplify console for the deployed URL"
    echo ""
    
    print_info "Next steps:"
    echo "1. Configure Stripe for payments"
    echo "2. Set up QuickBooks integration"
    echo "3. Upload product images to S3"
    echo "4. Configure social media integrations"
    echo "5. Set up monitoring and analytics"
    echo ""
    
    print_info "Useful commands:"
    echo "• Test API: curl '$API_BASE_URL/products?limit=3'"
    echo "• Invalidate cache: ./scripts/invalidate-cache.sh"
    echo "• View logs: aws logs describe-log-groups"
}

# Main deployment function
main() {
    print_header
    
    # Parse command line arguments
    SKIP_INFRASTRUCTURE=false
    SKIP_FRONTEND=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-infrastructure)
                SKIP_INFRASTRUCTURE=true
                shift
                ;;
            --skip-frontend)
                SKIP_FRONTEND=true
                shift
                ;;
            --help)
                echo "Usage: $0 [options]"
                echo "Options:"
                echo "  --skip-infrastructure    Skip infrastructure setup"
                echo "  --skip-frontend         Skip frontend deployment"
                echo "  --help                  Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    check_prerequisites
    
    if [ "$SKIP_INFRASTRUCTURE" = false ]; then
        setup_environment
        setup_s3
        setup_cloudfront
        deploy_lambda_functions
        setup_dynamodb
        seed_database
        setup_api_gateway
    fi
    
    if [ "$SKIP_FRONTEND" = false ]; then
        build_frontend
        deploy_frontend
    fi
    
    test_deployment
    show_summary
}

# Run main function
main "$@"
