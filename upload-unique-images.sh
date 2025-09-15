#!/bin/bash

# Define S3 bucket and folder structure
BUCKET="king-covy-assets"
PRODUCTS_DIR="products"
CATEGORIES_DIR="categories"
BRANDS_DIR="brands"

echo "🚀 Starting upload of UNIQUE category-specific images to S3..."
echo "📦 Bucket: $BUCKET"
echo ""

# Define arrays for URLs and destinations with UNIQUE images
declare -a urls=(
  # Category Images - Each with unique golf equipment
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Drivers
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Putters
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Irons
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Wedges
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Fairway Woods
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Hybrids
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Accessories
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Collectibles
  
  # Product Images - Unique for each product type
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Titleist TSR3 Driver
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Generic Driver
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Scotty Cameron Newport 2
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Generic Putter
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Mizuno MP-20 Irons
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Generic Irons
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Cleveland RTX 6 Wedge
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Vokey SM9 Wedge Set
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # TaylorMade Stealth 2 Fairway
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Generic Fairway Wood
  
  # Brand Logos - Simple colored rectangles for now (we'll get real logos later)
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"  # Titleist
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"  # Callaway
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"  # TaylorMade
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"  # Ping
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"  # Mizuno
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"  # Scotty Cameron
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"  # Odyssey
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"  # Cleveland
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"  # Bettinardi
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"  # Cobra
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"  # Wilson
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=200&h=100&fit=crop&crop=center"  # Srixon
)

declare -a destinations=(
  # Category Images
  "$CATEGORIES_DIR/drivers.jpg"
  "$CATEGORIES_DIR/putters.jpg"
  "$CATEGORIES_DIR/irons.jpg"
  "$CATEGORIES_DIR/wedges.jpg"
  "$CATEGORIES_DIR/fairway-woods.jpg"
  "$CATEGORIES_DIR/hybrids.jpg"
  "$CATEGORIES_DIR/accessories.jpg"
  "$CATEGORIES_DIR/collectibles.jpg"
  
  # Product Images
  "$PRODUCTS_DIR/drivers/titleist-tsr3-driver.jpg"
  "$PRODUCTS_DIR/drivers/generic-driver.jpg"
  "$PRODUCTS_DIR/putters/scotty-cameron-newport-2.jpg"
  "$PRODUCTS_DIR/putters/generic-putter.jpg"
  "$PRODUCTS_DIR/irons/mizuno-mp20-irons.jpg"
  "$PRODUCTS_DIR/irons/generic-irons.jpg"
  "$PRODUCTS_DIR/wedges/cleveland-rtx-6-wedge.jpg"
  "$PRODUCTS_DIR/wedges/vokey-sm9-wedge-set.jpg"
  "$PRODUCTS_DIR/fairway-woods/taylormade-stealth-2-fairway.jpg"
  "$PRODUCTS_DIR/fairway-woods/generic-fairway-wood.jpg"
  
  # Brand Logos
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

echo "⚠️  WARNING: This will upload the SAME generic image to all locations!"
echo "   We need to find UNIQUE images for each category first."
echo ""
echo "📋 Current plan:"
echo "   1. Upload placeholder images to verify structure works"
echo "   2. Then replace with unique category-specific images"
echo ""

read -p "Continue with generic placeholders? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled. Let's find unique images first."
    exit 1
fi

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
echo "⚠️  NEXT STEPS:"
echo "   1. Find UNIQUE images for each category:"
echo "      • Drivers: Golf driver head"
echo "      • Putters: Golf putter head"
echo "      • Irons: Golf iron head"
echo "      • Wedges: Golf wedge head"
echo "      • Fairway Woods: Golf fairway wood"
echo "      • Hybrids: Golf hybrid club"
echo "      • Accessories: Golf accessories (gloves, balls, etc.)"
echo "      • Collectibles: Vintage/rare golf equipment"
echo ""
echo "   2. Replace generic images with category-specific ones"
echo "   3. Test that each category shows its unique image"
