#!/bin/bash

# King Covy Golf Club - S3 Setup Script
# This script creates and configures S3 buckets for assets

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BUCKET_NAME="king-covy-assets"
REGION="us-east-1"

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}  King Covy S3 Setup${NC}"
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

# Create S3 bucket
create_bucket() {
    print_info "Creating S3 bucket: $BUCKET_NAME"
    
    # Check if bucket already exists
    if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
        # Create bucket
        if [ "$REGION" = "us-east-1" ]; then
            aws s3 mb "s3://$BUCKET_NAME"
        else
            aws s3 mb "s3://$BUCKET_NAME" --region "$REGION"
        fi
        print_status "S3 bucket created: $BUCKET_NAME"
    else
        print_warning "S3 bucket already exists: $BUCKET_NAME"
    fi
}

# Configure bucket policy for public read access to assets
configure_bucket_policy() {
    print_info "Configuring bucket policy for public read access..."
    
    cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF
    
    aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy file://bucket-policy.json
    rm bucket-policy.json
    print_status "Bucket policy configured for public read access"
}

# Configure CORS for web access
configure_cors() {
    print_info "Configuring CORS for web access..."
    
    cat > cors-config.json << EOF
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "HEAD"],
            "AllowedOrigins": ["*"],
            "ExposeHeaders": ["ETag"]
        }
    ]
}
EOF
    
    aws s3api put-bucket-cors --bucket "$BUCKET_NAME" --cors-configuration file://cors-config.json
    rm cors-config.json
    print_status "CORS configured"
}

# Enable versioning
enable_versioning() {
    print_info "Enabling versioning..."
    
    aws s3api put-bucket-versioning \
        --bucket "$BUCKET_NAME" \
        --versioning-configuration Status=Enabled
    
    print_status "Versioning enabled"
}

# Create folder structure
create_folder_structure() {
    print_info "Creating folder structure..."
    
    # Create main folders
    folders=(
        "products/"
        "products/images/"
        "products/thumbnails/"
        "brands/"
        "categories/"
        "uploads/"
        "temp/"
    )
    
    for folder in "${folders[@]}"; do
        echo "Creating folder: $folder"
        aws s3api put-object --bucket "$BUCKET_NAME" --key "$folder"
    done
    
    print_status "Folder structure created"
}

# Upload placeholder images
upload_placeholders() {
    print_info "Uploading placeholder images..."
    
    # Create a simple placeholder image (1x1 pixel PNG)
    cat > placeholder.png << 'EOF'
iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==
EOF
    
    # Decode and upload
    base64 -d placeholder.png > temp_placeholder.png
    aws s3 cp temp_placeholder.png "s3://$BUCKET_NAME/products/placeholder-golf-club.png"
    
    # Clean up
    rm placeholder.png temp_placeholder.png
    
    print_status "Placeholder images uploaded"
}

# Configure lifecycle policy
configure_lifecycle() {
    print_info "Configuring lifecycle policy..."
    
    cat > lifecycle-config.json << EOF
{
    "Rules": [
        {
            "ID": "DeleteTempFiles",
            "Status": "Enabled",
            "Filter": {
                "Prefix": "temp/"
            },
            "Expiration": {
                "Days": 1
            }
        },
        {
            "ID": "TransitionOldVersions",
            "Status": "Enabled",
            "Filter": {
                "Prefix": ""
            },
            "NoncurrentVersionTransitions": [
                {
                    "NoncurrentDays": 30,
                    "StorageClass": "STANDARD_IA"
                }
            ]
        }
    ]
}
EOF
    
    aws s3api put-bucket-lifecycle-configuration \
        --bucket "$BUCKET_NAME" \
        --lifecycle-configuration file://lifecycle-config.json
    
    rm lifecycle-config.json
    print_status "Lifecycle policy configured"
}

# Update environment variables
update_env() {
    print_info "Updating environment variables..."
    
    # Add S3 bucket info to environment
    if [ -f ".env" ]; then
        # Remove existing S3 variables
        sed -i.bak '/^S3_BUCKET_NAME=/d' .env
        sed -i.bak '/^S3_REGION=/d' .env
        sed -i.bak '/^S3_BASE_URL=/d' .env
        
        # Add new S3 variables
        echo "" >> .env
        echo "# S3 Configuration" >> .env
        echo "S3_BUCKET_NAME=$BUCKET_NAME" >> .env
        echo "S3_REGION=$REGION" >> .env
        echo "S3_BASE_URL=https://$BUCKET_NAME.s3.$REGION.amazonaws.com" >> .env
        
        # Add to frontend environment
        echo "NEXT_PUBLIC_S3_BASE_URL=https://$BUCKET_NAME.s3.$REGION.amazonaws.com" >> .env
        
        rm .env.bak
        print_status "Environment variables updated"
    else
        print_warning ".env file not found. Please add these variables manually:"
        echo "S3_BUCKET_NAME=$BUCKET_NAME"
        echo "S3_REGION=$REGION"
        echo "S3_BASE_URL=https://$BUCKET_NAME.s3.$REGION.amazonaws.com"
        echo "NEXT_PUBLIC_S3_BASE_URL=https://$BUCKET_NAME.s3.$REGION.amazonaws.com"
    fi
}

# Main setup function
main() {
    print_header
    
    check_aws_cli
    create_bucket
    configure_bucket_policy
    configure_cors
    enable_versioning
    create_folder_structure
    upload_placeholders
    configure_lifecycle
    update_env
    
    print_status "S3 setup completed!"
    print_info "Bucket URL: https://$BUCKET_NAME.s3.$REGION.amazonaws.com"
    print_info "Next steps:"
    echo "1. Upload your product images to s3://$BUCKET_NAME/products/images/"
    echo "2. Update product data to use S3 URLs"
    echo "3. Set up CloudFront distribution for better performance"
}

# Run main function
main "$@"
