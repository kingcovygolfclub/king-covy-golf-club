#!/bin/bash

echo "🚀 Deploying King Covy Golf Club to AWS..."

# Set variables
BUCKET_NAME="king-covy-golf-club-frontend-$(date +%s)"
REGION="us-east-1"
STACK_NAME="king-covy-golf-club-stack"

echo "📦 Building the project..."
npm run build

echo "🪣 Creating S3 bucket: $BUCKET_NAME"
aws s3 mb s3://$BUCKET_NAME --region $REGION

echo "📤 Uploading files to S3..."
# Upload static files
aws s3 sync .next/static s3://$BUCKET_NAME/_next/static --delete
aws s3 sync public s3://$BUCKET_NAME --delete

# Upload HTML files
aws s3 cp .next/server/pages s3://$BUCKET_NAME --recursive --exclude "*.js" --exclude "*.map"
aws s3 cp .next/server/app s3://$BUCKET_NAME --recursive --exclude "*.js" --exclude "*.map"

echo "🌐 Configuring S3 for static website hosting..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document 404.html

echo "📋 Creating bucket policy for public read access..."
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

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

echo "✅ Frontend deployed!"
echo "🌐 Website URL: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

# Clean up
rm bucket-policy.json

echo ""
echo "🎉 Deployment complete!"
echo "Your site is now live at: http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo ""
echo "Next steps:"
echo "1. Set up CloudFront for HTTPS and better performance"
echo "2. Configure your domain name"
echo "3. Set up the backend (DynamoDB, Lambda, API Gateway)"
