# 🚀 Deploy King Covy Golf Club to AWS

## Method 1: AWS Amplify Console (Recommended - Easiest)

### Step 1: Push Your Code to GitHub
First, let's get your code on GitHub so Amplify can access it:

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - King Covy Golf Club"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/king-covy-golf-club.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy via AWS Console
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Choose **"GitHub"** as your repository provider
4. Connect your GitHub account and select your repository
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
6. Click **"Save and deploy"**

### Step 3: Configure Environment Variables
In the Amplify console, go to **"Environment variables"** and add:
- `NEXT_PUBLIC_API_URL`: `https://your-api-gateway-url.amazonaws.com/prod`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: `pk_test_your_stripe_key`
- `NEXT_PUBLIC_CLOUDFRONT_DOMAIN`: `your-cloudfront-domain.cloudfront.net`

---

## Method 2: Manual S3 + CloudFront (Quick Deploy)

### Step 1: Build and Deploy
```bash
# Build the project
npm run build

# Create S3 bucket (replace with unique name)
aws s3 mb s3://king-covy-golf-club-$(date +%s)

# Upload files
aws s3 sync .next/static s3://your-bucket-name/_next/static
aws s3 sync public s3://your-bucket-name
aws s3 cp .next/server/pages s3://your-bucket-name --recursive

# Configure for static hosting
aws s3 website s3://your-bucket-name --index-document index.html --error-document 404.html
```

### Step 2: Create CloudFront Distribution
1. Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Create distribution
3. Set origin to your S3 bucket
4. Configure caching and HTTPS

---

## Method 3: Vercel (Alternative - Very Easy)

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel auto-detects Next.js and deploys
4. Add environment variables in dashboard

---

## Next Steps After Deployment

1. **Set up backend** (DynamoDB, Lambda, API Gateway)
2. **Configure Stripe** for payments
3. **Set up domain name**
4. **Add SSL certificate**
5. **Configure monitoring**

Choose the method that works best for you!
