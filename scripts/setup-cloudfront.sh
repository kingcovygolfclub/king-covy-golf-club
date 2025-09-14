#!/bin/bash

# King Covy Golf Club - CloudFront Setup Script
# This script creates and configures CloudFront distribution for S3 assets

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

S3_BUCKET="king-covy-assets"
S3_REGION="us-east-1"
DISTRIBUTION_DOMAIN=""

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  King Covy CloudFront Setup${NC}"
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

# Check AWS CLI
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS CLI is not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    print_status "AWS CLI is configured"
}

# Check if S3 bucket exists
check_s3_bucket() {
    if ! aws s3 ls "s3://$S3_BUCKET" &> /dev/null; then
        print_error "S3 bucket '$S3_BUCKET' does not exist. Please run setup-s3.sh first."
        exit 1
    fi
    
    print_status "S3 bucket verified: $S3_BUCKET"
}

# Create CloudFront distribution
create_cloudfront_distribution() {
    print_info "Creating CloudFront distribution..."
    
    # Create distribution configuration
    cat > cloudfront-config.json << EOF
{
    "CallerReference": "king-covy-assets-$(date +%s)",
    "Comment": "King Covy Golf Club - Assets Distribution",
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$S3_BUCKET",
                "DomainName": "$S3_BUCKET.s3.amazonaws.com",
                "S3OriginConfig": {
                    "OriginAccessIdentity": ""
                },
                "OriginPath": ""
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$S3_BUCKET",
        "ViewerProtocolPolicy": "redirect-to-https",
        "TrustedSigners": {
            "Enabled": false,
            "Quantity": 0
        },
        "ForwardedValues": {
            "QueryString": false,
            "Cookies": {
                "Forward": "none"
            },
            "Headers": {
                "Quantity": 0
            }
        },
        "MinTTL": 0,
        "DefaultTTL": 86400,
        "MaxTTL": 31536000,
        "Compress": true
    },
    "CacheBehaviors": {
        "Quantity": 2,
        "Items": [
            {
                "PathPattern": "products/images/*",
                "TargetOriginId": "S3-$S3_BUCKET",
                "ViewerProtocolPolicy": "redirect-to-https",
                "TrustedSigners": {
                    "Enabled": false,
                    "Quantity": 0
                },
                "ForwardedValues": {
                    "QueryString": false,
                    "Cookies": {
                        "Forward": "none"
                    },
                    "Headers": {
                        "Quantity": 0
                    }
                },
                "MinTTL": 0,
                "DefaultTTL": 2592000,
                "MaxTTL": 31536000,
                "Compress": true
            },
            {
                "PathPattern": "products/thumbnails/*",
                "TargetOriginId": "S3-$S3_BUCKET",
                "ViewerProtocolPolicy": "redirect-to-https",
                "TrustedSigners": {
                    "Enabled": false,
                    "Quantity": 0
                },
                "ForwardedValues": {
                    "QueryString": false,
                    "Cookies": {
                        "Forward": "none"
                    },
                    "Headers": {
                        "Quantity": 0
                    }
                },
                "MinTTL": 0,
                "DefaultTTL": 2592000,
                "MaxTTL": 31536000,
                "Compress": true
            }
        ]
    },
    "PriceClass": "PriceClass_100",
    "Enabled": true,
    "HttpVersion": "http2",
    "CustomErrorResponses": {
        "Quantity": 2,
        "Items": [
            {
                "ErrorCode": 403,
                "ResponsePagePath": "/error/403.html",
                "ResponseCode": "403",
                "ErrorCachingMinTTL": 300
            },
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/error/404.html",
                "ResponseCode": "404",
                "ErrorCachingMinTTL": 300
            }
        ]
    }
}
EOF
    
    # Create the distribution
    DISTRIBUTION_OUTPUT=$(aws cloudfront create-distribution --distribution-config file://cloudfront-config.json)
    
    # Extract distribution ID and domain
    DISTRIBUTION_ID=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Distribution.Id')
    DISTRIBUTION_DOMAIN=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Distribution.DomainName')
    
    # Clean up
    rm cloudfront-config.json
    
    print_status "CloudFront distribution created"
    print_info "Distribution ID: $DISTRIBUTION_ID"
    print_info "Distribution Domain: $DISTRIBUTION_DOMAIN"
}

# Wait for distribution to be deployed
wait_for_deployment() {
    print_info "Waiting for CloudFront distribution to be deployed..."
    print_warning "This may take 10-15 minutes..."
    
    aws cloudfront wait distribution-deployed --id "$DISTRIBUTION_ID"
    
    print_status "CloudFront distribution is deployed and ready"
}

# Update environment variables
update_env() {
    print_info "Updating environment variables..."
    
    if [ -f ".env" ]; then
        # Remove existing CloudFront variables
        sed -i.bak '/^CLOUDFRONT_DISTRIBUTION_ID=/d' .env
        sed -i.bak '/^CLOUDFRONT_DOMAIN=/d' .env
        sed -i.bak '/^NEXT_PUBLIC_CDN_URL=/d' .env
        
        # Add new CloudFront variables
        echo "" >> .env
        echo "# CloudFront Configuration" >> .env
        echo "CLOUDFRONT_DISTRIBUTION_ID=$DISTRIBUTION_ID" >> .env
        echo "CLOUDFRONT_DOMAIN=$DISTRIBUTION_DOMAIN" >> .env
        echo "NEXT_PUBLIC_CDN_URL=https://$DISTRIBUTION_DOMAIN" >> .env
        
        rm .env.bak
        print_status "Environment variables updated"
    else
        print_warning ".env file not found. Please add these variables manually:"
        echo "CLOUDFRONT_DISTRIBUTION_ID=$DISTRIBUTION_ID"
        echo "CLOUDFRONT_DOMAIN=$DISTRIBUTION_DOMAIN"
        echo "NEXT_PUBLIC_CDN_URL=https://$DISTRIBUTION_DOMAIN"
    fi
}

# Create invalidation function
create_invalidation() {
    print_info "Creating invalidation function..."
    
    cat > scripts/invalidate-cache.sh << 'EOF'
#!/bin/bash

# Invalidate CloudFront cache
# Usage: ./scripts/invalidate-cache.sh [path]

DISTRIBUTION_ID=$(grep CLOUDFRONT_DISTRIBUTION_ID .env | cut -d '=' -f2)
PATH_TO_INVALIDATE=${1:-"/*"}

if [ -z "$DISTRIBUTION_ID" ]; then
    echo "Error: CloudFront distribution ID not found in .env file"
    exit 1
fi

echo "Invalidating CloudFront cache for distribution: $DISTRIBUTION_ID"
echo "Path: $PATH_TO_INVALIDATE"

aws cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths "$PATH_TO_INVALIDATE"

echo "Invalidation created successfully"
EOF
    
    chmod +x scripts/invalidate-cache.sh
    print_status "Cache invalidation script created"
}

# Main setup function
main() {
    print_header
    
    check_aws_cli
    check_s3_bucket
    create_cloudfront_distribution
    wait_for_deployment
    update_env
    create_invalidation
    
    print_status "CloudFront setup completed!"
    print_info "CDN URL: https://$DISTRIBUTION_DOMAIN"
    print_info "Next steps:"
    echo "1. Update your application to use the CDN URL for assets"
    echo "2. Test asset loading through CloudFront"
    echo "3. Use ./scripts/invalidate-cache.sh to clear cache when needed"
}

# Run main function
main "$@"
