#!/bin/bash

# Define S3 bucket and folder structure
BUCKET="king-covy-assets"
CATEGORIES_DIR="categories"

echo "🚀 Uploading UNIQUE category-specific images to S3..."
echo "📦 Bucket: $BUCKET"
echo ""

# Function to upload a single image
upload_image() {
  local url="$1"
  local dest_path="$2"
  local description="$3"
  
  echo "📸 Processing: $description"
  echo "   📥 Source: $url"
  echo "   📤 Destination: s3://$BUCKET/$dest_path"
  
  if curl -s "$url" -o /tmp/temp-image.jpg; then
    if aws s3 cp /tmp/temp-image.jpg "s3://$BUCKET/$dest_path" --quiet; then
      echo "   ✅ Success!"
      return 0
    else
      echo "   ❌ Upload failed!"
      return 1
    fi
    rm -f /tmp/temp-image.jpg
  else
    echo "   ❌ Download failed!"
    return 1
  fi
}

echo "🔍 Uploading UNIQUE images for each category..."
echo ""

# Upload unique category images using different Unsplash image IDs
upload_image "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center" "$CATEGORIES_DIR/drivers.jpg" "Drivers Category"
upload_image "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center" "$CATEGORIES_DIR/putters.jpg" "Putters Category"
upload_image "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center" "$CATEGORIES_DIR/irons.jpg" "Irons Category"
upload_image "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center" "$CATEGORIES_DIR/wedges.jpg" "Wedges Category"
upload_image "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center" "$CATEGORIES_DIR/fairway-woods.jpg" "Fairway Woods Category"
upload_image "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center" "$CATEGORIES_DIR/hybrids.jpg" "Hybrids Category"
upload_image "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center" "$CATEGORIES_DIR/accessories.jpg" "Accessories Category"
upload_image "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center" "$CATEGORIES_DIR/collectibles.jpg" "Collectibles Category"

echo ""
echo "🎉 Category images uploaded!"
echo ""
echo "⚠️  WARNING: All images are currently the SAME!"
echo ""
echo "📋 TO GET UNIQUE IMAGES:"
echo "   1. Find 8 different Unsplash image URLs"
echo "   2. Replace the URLs in this script"
echo "   3. Run the script again"
echo ""
echo "🔗 Test URLs:"
echo "   • Drivers: https://$BUCKET.s3.amazonaws.com/$CATEGORIES_DIR/drivers.jpg"
echo "   • Putters: https://$BUCKET.s3.amazonaws.com/$CATEGORIES_DIR/putters.jpg"
echo "   • Irons: https://$BUCKET.s3.amazonaws.com/$CATEGORIES_DIR/irons.jpg"
echo "   • Wedges: https://$BUCKET.s3.amazonaws.com/$CATEGORIES_DIR/wedges.jpg"
