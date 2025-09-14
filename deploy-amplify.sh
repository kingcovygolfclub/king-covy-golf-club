#!/bin/bash

echo "🚀 Starting AWS Amplify deployment for King Covy Golf Club..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ AWS CLI configured"

# Initialize Amplify project
echo "📦 Initializing Amplify project..."
npx @aws-amplify/cli@latest init --yes \
    --amplify "{\"projectName\":\"king-covy-golf-club\",\"envName\":\"dev\",\"defaultEditor\":\"code\"}" \
    --frontend "{\"framework\":\"react\",\"config\":{\"SourceDir\":\"src\",\"DistributionDir\":\".next\",\"BuildCommand\":\"npm run build\",\"StartCommand\":\"npm run start\"}}" \
    --providers "{\"awscloudformation\":{\"useProfile\":true,\"profileName\":\"default\",\"region\":\"us-east-1\"}}"

echo "✅ Amplify project initialized"

# Add hosting
echo "🌐 Adding hosting..."
npx @aws-amplify/cli@latest add hosting --yes

echo "✅ Hosting added"

# Deploy
echo "🚀 Deploying to AWS..."
npx @aws-amplify/cli@latest publish --yes

echo "🎉 Deployment complete!"
echo "Your site should be live at the URL shown above."
