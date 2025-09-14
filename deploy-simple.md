# Simple AWS Deployment Guide

Since Amplify CLI had issues, let's use the AWS Console for deployment.

## Method 1: AWS Amplify Console (Recommended - Easiest)

### Step 1: Prepare Your Code
1. Your code is already ready in the current directory
2. Make sure you're on the main branch: `git add . && git commit -m "Ready for deployment"`

### Step 2: Deploy via AWS Console
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Choose "GitHub" as your repository provider
4. Connect your GitHub account and select this repository
5. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
         - .next/cache/**/*
   ```
6. Click "Save and deploy"

### Step 3: Configure Environment Variables
In the Amplify console, go to "Environment variables" and add:
- `NEXT_PUBLIC_API_URL`: Your API Gateway URL (we'll create this next)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `NEXT_PUBLIC_CLOUDFRONT_DOMAIN`: Your CloudFront domain

## Method 2: Manual S3 + CloudFront Deployment

### Step 1: Build the Project
```bash
npm run build
```

### Step 2: Create S3 Bucket
```bash
aws s3 mb s3://king-covy-golf-club-frontend
```

### Step 3: Upload Files
```bash
aws s3 sync .next/static s3://king-covy-golf-club-frontend/static
aws s3 sync public s3://king-covy-golf-club-frontend
aws s3 cp .next/standalone/ s3://king-covy-golf-club-frontend/ --recursive
```

### Step 4: Configure S3 for Static Website Hosting
```bash
aws s3 website s3://king-covy-golf-club-frontend --index-document index.html --error-document 404.html
```

### Step 5: Create CloudFront Distribution
Use the AWS Console to create a CloudFront distribution pointing to your S3 bucket.

## Method 3: Vercel (Alternative - Very Easy)

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will auto-detect Next.js and deploy automatically
4. Add environment variables in Vercel dashboard

Choose the method that works best for you!
