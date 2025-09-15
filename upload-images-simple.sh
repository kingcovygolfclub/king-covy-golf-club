#!/bin/bash

# Define S3 bucket and folder structure
BUCKET="king-covy-assets"
PRODUCTS_DIR="products"
CATEGORIES_DIR="categories"
BRANDS_DIR="brands"

echo "🚀 Starting automated image upload to S3..."
echo "📦 Bucket: $BUCKET"
echo ""

# Define arrays for URLs and destinations
declare -a urls=(
  # Product Images (400x300px) - Drivers
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  
  # Product Images (400x300px) - Putters
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  
  # Product Images (400x300px) - Irons
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  
  # Product Images (400x300px) - Wedges
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  
  # Product Images (400x300px) - Fairway Woods
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  
  # Category Images (400x300px)
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
  
  # Brand Logos (200x100px)
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"
)

declare -a destinations=(
  # Product Images (400x300px) - Drivers
  "$PRODUCTS_DIR/drivers/titleist-tsr3-driver.jpg"
  "$PRODUCTS_DIR/drivers/generic-driver.jpg"
  
  # Product Images (400x300px) - Putters
  "$PRODUCTS_DIR/putters/scotty-cameron-newport-2.jpg"
  "$PRODUCTS_DIR/putters/generic-putter.jpg"
  
  # Product Images (400x300px) - Irons
  "$PRODUCTS_DIR/irons/mizuno-mp20-irons.jpg"
  "$PRODUCTS_DIR/irons/generic-irons.jpg"
  
  # Product Images (400x300px) - Wedges
  "$PRODUCTS_DIR/wedges/cleveland-rtx-6-wedge.jpg"
  "$PRODUCTS_DIR/wedges/vokey-sm9-wedge-set.jpg"
  
  # Product Images (400x300px) - Fairway Woods
  "$PRODUCTS_DIR/fairway-woods/taylormade-stealth-2-fairway.jpg"
  "$PRODUCTS_DIR/fairway-woods/generic-fairway-wood.jpg"
  
  # Category Images (400x300px)
  "$CATEGORIES_DIR/drivers.jpg"
  "$CATEGORIES_DIR/putters.jpg"
  "$CATEGORIES_DIR/irons.jpg"
  "$CATEGORIES_DIR/wedges.jpg"
  "$CATEGORIES_DIR/fairway-woods.jpg"
  "$CATEGORIES_DIR/hybrids.jpg"
  "$CATEGORIES_DIR/accessories.jpg"
  "$CATEGORIES_DIR/collectibles.jpg"
  
  # Brand Logos (200x100px)
  "$BRANDS_DIR/titleist-logo.png"
  "$BRANDS_DIR/callaway-logo.png"
  "$BRANDS_DIR/taylormade-logo.png"
  "$BRANDS_DIR/ping-logo.png"
  "$BRANDS_DIR/mizuno-logo.png"
  "$BRANDS_DIR/scotty-cameron-logo.png"
  "$BRANDS_DIR/odyssey-logo.png"
  "$BRANDS_DIR/cleveland-logo.png"
  "$BRANDS_DIR/bettinardi-logo.png"
  "$BRANDS_DIR/cobra-logo.png"
  "$BRANDS_DIR/wilson-logo.png"
  "$BRANDS_DIR/srixon-logo.png"
)

# Counter for progress tracking
total_images=${#urls[@]}
current_image=0

# Loop through images and upload to S3
for i in "${!urls[@]}"; do
  url="${urls[$i]}"
  dest_path="${destinations[$i]}"
  current_image=$((current_image + 1))
  
  echo "[$current_image/$total_images] 📸 Processing: $(basename "$dest_path")"
  echo "   📥 Source: $url"
  echo "   📤 Destination: s3://$BUCKET/$dest_path"
  
  # Use curl to fetch and pipe to aws s3 cp
  if curl -s "$url" -o /tmp/temp-image.jpg; then
    if aws s3 cp /tmp/temp-image.jpg "s3://$BUCKET/$dest_path" --quiet; then
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
