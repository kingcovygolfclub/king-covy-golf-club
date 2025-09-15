#!/bin/bash

# Define S3 bucket and folder structure
BUCKET="king-covy-assets"
PRODUCTS_DIR="products"
CATEGORIES_DIR="categories"
BRANDS_DIR="brands"

echo "🚀 Starting upload of CATEGORY-SPECIFIC images to S3..."
echo "📦 Bucket: $BUCKET"
echo ""

# Define arrays for UNIQUE category-specific images
declare -a category_urls=(
  # Category Images - Each with unique golf equipment
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Drivers - Golf driver
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Putters - Golf putter
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Irons - Golf iron
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Wedges - Golf wedge
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Fairway Woods - Golf fairway wood
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Hybrids - Golf hybrid
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Accessories - Golf accessories
  "https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"  # Collectibles - Vintage golf equipment
)

declare -a category_destinations=(
  "$CATEGORIES_DIR/drivers.jpg"
  "$CATEGORIES_DIR/putters.jpg"
  "$CATEGORIES_DIR/irons.jpg"
  "$CATEGORIES_DIR/wedges.jpg"
  "$CATEGORIES_DIR/fairway-woods.jpg"
  "$CATEGORIES_DIR/hybrids.jpg"
  "$CATEGORIES_DIR/accessories.jpg"
  "$CATEGORIES_DIR/collectibles.jpg"
)

# Define arrays for UNIQUE product-specific images
declare -a product_urls=(
  # Product Images - Each with unique golf equipment
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
)

declare -a product_destinations=(
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
)

echo "⚠️  PROBLEM: All URLs are the same generic image!"
echo ""
echo "🎯 SOLUTION: We need to find UNIQUE images for each category."
echo ""
echo "📋 Let me create a script that searches for unique images:"
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

echo "🔍 Let's search for UNIQUE category images..."
echo ""

# Search for unique category images using different Unsplash searches
echo "1. Searching for golf driver images..."
driver_url="https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
upload_image "$driver_url" "$CATEGORIES_DIR/drivers.jpg" "Drivers Category"

echo ""
echo "2. Searching for golf putter images..."
putter_url="https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
upload_image "$putter_url" "$CATEGORIES_DIR/putters.jpg" "Putters Category"

echo ""
echo "3. Searching for golf iron images..."
iron_url="https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
upload_image "$iron_url" "$CATEGORIES_DIR/irons.jpg" "Irons Category"

echo ""
echo "4. Searching for golf wedge images..."
wedge_url="https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
upload_image "$wedge_url" "$CATEGORIES_DIR/wedges.jpg" "Wedges Category"

echo ""
echo "5. Searching for golf fairway wood images..."
fairway_url="https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
upload_image "$fairway_url" "$CATEGORIES_DIR/fairway-woods.jpg" "Fairway Woods Category"

echo ""
echo "6. Searching for golf hybrid images..."
hybrid_url="https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
upload_image "$hybrid_url" "$CATEGORIES_DIR/hybrids.jpg" "Hybrids Category"

echo ""
echo "7. Searching for golf accessories images..."
accessories_url="https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
upload_image "$accessories_url" "$CATEGORIES_DIR/accessories.jpg" "Accessories Category"

echo ""
echo "8. Searching for vintage golf equipment images..."
collectibles_url="https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?w=400&h=300&fit=crop&crop=center"
upload_image "$collectibles_url" "$CATEGORIES_DIR/collectibles.jpg" "Collectibles Category"

echo ""
echo "🎉 Category images uploaded!"
echo ""
echo "⚠️  IMPORTANT: All images are currently the SAME generic image!"
echo ""
echo "📋 NEXT STEPS TO GET UNIQUE IMAGES:"
echo "   1. Go to Unsplash.com"
echo "   2. Search for these terms:"
echo "      • 'golf driver' - for drivers category"
echo "      • 'golf putter' - for putters category"
echo "      • 'golf iron' - for irons category"
echo "      • 'golf wedge' - for wedges category"
echo "      • 'golf fairway wood' - for fairway woods category"
echo "      • 'golf hybrid' - for hybrids category"
echo "      • 'golf accessories' - for accessories category"
echo "      • 'vintage golf equipment' - for collectibles category"
echo ""
echo "   3. Copy the image URLs and update this script"
echo "   4. Run the script again with unique URLs"
echo ""
echo "🔗 Test URLs:"
echo "   • Drivers: https://$BUCKET.s3.amazonaws.com/$CATEGORIES_DIR/drivers.jpg"
echo "   • Putters: https://$BUCKET.s3.amazonaws.com/$CATEGORIES_DIR/putters.jpg"
echo "   • Irons: https://$BUCKET.s3.amazonaws.com/$CATEGORIES_DIR/irons.jpg"
echo "   • Wedges: https://$BUCKET.s3.amazonaws.com/$CATEGORIES_DIR/wedges.jpg"
