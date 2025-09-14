#!/bin/bash

# King Covy Golf Club - Environment Setup Script
# This script helps configure environment variables for different services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  King Covy Environment Setup${NC}"
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

# Check if .env file exists
check_env_file() {
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from template..."
        cp env.example .env
        print_status "Created .env file from template"
        print_info "Please edit .env file with your actual values"
        return 1
    else
        print_status ".env file exists"
        return 0
    fi
}

# Setup AWS Amplify environment variables
setup_amplify_env() {
    print_info "Setting up AWS Amplify environment variables..."
    
    # Check if amplify is initialized
    if [ ! -d "amplify" ]; then
        print_warning "Amplify not initialized. Skipping Amplify env setup."
        return 0
    fi
    
    # Add environment variables to Amplify
    echo "Adding environment variables to Amplify..."
    
    # Get current environment variables from .env
    if [ -f ".env" ]; then
        while IFS='=' read -r key value; do
            # Skip comments and empty lines
            if [[ ! $key =~ ^# ]] && [[ -n $key ]] && [[ -n $value ]]; then
                # Remove quotes from value
                value=$(echo $value | sed 's/^"//' | sed 's/"$//')
                echo "Setting $key in Amplify..."
                amplify env add --name $key --value "$value" 2>/dev/null || true
            fi
        done < .env
    fi
    
    print_status "Amplify environment variables configured"
}

# Setup Lambda environment variables
setup_lambda_env() {
    print_info "Setting up Lambda environment variables..."
    
    # Create environment variables file for Lambda
    cat > lambda-env.json << EOF
{
    "PRODUCTS_TABLE": "king-covy-products",
    "ORDERS_TABLE": "king-covy-orders", 
    "CUSTOMERS_TABLE": "king-covy-customers",
    "INVENTORY_TABLE": "king-covy-inventory",
    "AWS_REGION": "us-east-1"
}
EOF
    
    print_status "Lambda environment variables file created"
}

# Setup Stripe configuration
setup_stripe() {
    print_info "Setting up Stripe configuration..."
    
    if [ -f ".env" ]; then
        # Check if Stripe keys are set
        if grep -q "STRIPE_SECRET_KEY=sk_" .env; then
            print_status "Stripe secret key found"
        else
            print_warning "Stripe secret key not configured in .env"
        fi
        
        if grep -q "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_" .env; then
            print_status "Stripe publishable key found"
        else
            print_warning "Stripe publishable key not configured in .env"
        fi
    fi
    
    print_info "To get Stripe keys:"
    echo "1. Go to https://dashboard.stripe.com/apikeys"
    echo "2. Copy your publishable key to NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    echo "3. Copy your secret key to STRIPE_SECRET_KEY"
}

# Setup QuickBooks configuration
setup_quickbooks() {
    print_info "Setting up QuickBooks Online configuration..."
    
    print_info "To set up QuickBooks:"
    echo "1. Go to https://developer.intuit.com/"
    echo "2. Create a new app and get your Client ID and Secret"
    echo "3. Set QB_CLIENT_ID and QB_CLIENT_SECRET in .env"
    echo "4. Set QB_REDIRECT_URI to your domain + /api/qb/callback"
}

# Setup social media APIs
setup_social_apis() {
    print_info "Setting up Social Media API configurations..."
    
    print_info "Instagram Shopping:"
    echo "1. Create Instagram Business account"
    echo "2. Connect to Facebook Business Manager"
    echo "3. Set up Instagram Shopping"
    
    print_info "Facebook Marketplace:"
    echo "1. Create Facebook App at https://developers.facebook.com/"
    echo "2. Add Marketplace API"
    echo "3. Set FACEBOOK_APP_ID and FACEBOOK_APP_SECRET"
    
    print_info "Pinterest Shopping:"
    echo "1. Apply for Pinterest Shopping API"
    echo "2. Get access token"
    echo "3. Set PINTEREST_ACCESS_TOKEN"
}

# Validate environment configuration
validate_env() {
    print_info "Validating environment configuration..."
    
    if [ ! -f ".env" ]; then
        print_error ".env file not found"
        return 1
    fi
    
    # Check required variables
    required_vars=(
        "NEXT_PUBLIC_API_BASE_URL"
        "PRODUCTS_TABLE"
        "ORDERS_TABLE"
        "CUSTOMERS_TABLE"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" .env; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -eq 0 ]; then
        print_status "All required environment variables are set"
        return 0
    else
        print_warning "Missing required environment variables:"
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        return 1
    fi
}

# Main setup function
main() {
    print_header
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "Please run this script from the project root directory"
        exit 1
    fi
    
    # Setup steps
    check_env_file
    setup_lambda_env
    setup_stripe
    setup_quickbooks
    setup_social_apis
    validate_env
    
    print_status "Environment setup completed!"
    print_info "Next steps:"
    echo "1. Edit .env file with your actual API keys and secrets"
    echo "2. Run 'npm run dev' to test locally"
    echo "3. Deploy to AWS Amplify when ready"
}

# Run main function
main "$@"
