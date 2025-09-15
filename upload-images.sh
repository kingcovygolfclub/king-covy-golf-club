#!/bin/bash

# Define S3 bucket and folder structure
BUCKET="king-covy-assets"
PRODUCTS_DIR="products"
CATEGORIES_DIR="categories"
BRANDS_DIR="brands"

echo "🚀 Starting automated image upload to S3..."
echo "📦 Bucket: $BUCKET"
echo ""

# Array of image URLs with destination paths
declare -A images

# Product Images (400x300px) - Drivers
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$PRODUCTS_DIR/drivers/titleist-tsr3-driver.jpg"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$PRODUCTS_DIR/drivers/generic-driver.jpg"

# Product Images (400x300px) - Putters
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$PRODUCTS_DIR/putters/scotty-cameron-newport-2.jpg"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$PRODUCTS_DIR/putters/generic-putter.jpg"

# Product Images (400x300px) - Irons
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$PRODUCTS_DIR/irons/mizuno-mp20-irons.jpg"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$PRODUCTS_DIR/irons/generic-irons.jpg"

# Product Images (400x300px) - Wedges
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$PRODUCTS_DIR/wedges/cleveland-rtx-6-wedge.jpg"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$PRODUCTS_DIR/wedges/vokey-sm9-wedge-set.jpg"

# Product Images (400x300px) - Fairway Woods
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$PRODUCTS_DIR/fairway-woods/taylormade-stealth-2-fairway.jpg"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$PRODUCTS_DIR/fairway-woods/generic-fairway-wood.jpg"

# Category Images (400x300px)
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$CATEGORIES_DIR/drivers.jpg"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$CATEGORIES_DIR/putters.jpg"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$CATEGORIES_DIR/irons.jpg"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$CATEGORIES_DIR/wedges.jpg"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$CATEGORIES_DIR/fairway-woods.jpg"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$CATEGORIES_DIR/hybrids.jpg"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$CATEGORIES_DIR/accessories.jpg"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"]="$CATEGORIES_DIR/collectibles.jpg"

# Brand Logos (200x100px)
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"]="$BRANDS_DIR/titleist-logo.png"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"]="$BRANDS_DIR/callaway-logo.png"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"]="$BRANDS_DIR/taylormade-logo.png"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"]="$BRANDS_DIR/ping-logo.png"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"]="$BRANDS_DIR/mizuno-logo.png"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"]="$BRANDS_DIR/scotty-cameron-logo.png"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"]="$BRANDS_DIR/odyssey-logo.png"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"]="$BRANDS_DIR/cleveland-logo.png"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"]="$BRANDS_DIR/bettinardi-logo.png"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"]="$BRANDS_DIR/cobra-logo.png"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"]="$BRANDS_DIR/wilson-logo.png"
images["https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"]="$BRANDS_DIR/srixon-logo.png"

# Counter for progress tracking
total_images=${#images[@]}
current_image=0

# Loop through images and upload to S3
for url in "${!images[@]}"; do
  dest_path="${images[$url]}"
  current_image=$((current_image + 1))
  
  echo "[$current_image/$total_images] 📸 Processing: $(basename "$dest_path")"
  echo "   📥 Source: $url"
  echo "   📤 Destination: s3://$BUCKET/$dest_path"
  
  # Use curl to fetch and pipe to aws s3 cp
  if curl -s "$url" -o /tmp/temp-image.jpg; then
    if aws s3 cp /tmp/temp-image.jpg "s3://$BUCKET/$dest_path" --acl public-read --quiet; then
      echo "   ✅ Success!"
    else
      echo "   ❌ Upload failed!"
    fi
    rm -f /tmp/temp-image.jpg
  else
    echo "   ❌ Download failed!"
  fi
  echo ""
done

echo "🎉 Upload complete!"
echo ""
echo "📊 Summary:"
echo "   • Total images processed: $total_images"
echo "   • S3 Bucket: $BUCKET"
echo "   • Base URL: https://$BUCKET.s3.amazonaws.com/"
echo ""
echo "🔗 Test URLs:"
echo "   • Product: https://$BUCKET.s3.amazonaws.com/$PRODUCTS_DIR/drivers/titleist-tsr3-driver.jpg"
echo "   • Category: https://$BUCKET.s3.amazonaws.com/$CATEGORIES_DIR/drivers.jpg"
echo "   • Brand: https://$BUCKET.s3.amazonaws.com/$BRANDS_DIR/titleist-logo.png"
echo ""
echo "🔄 Next steps:"
echo "   1. Test the URLs above in your browser"
echo "   2. Update the frontend to use these new image URLs"
echo "   3. Invalidate CloudFront cache if needed"
