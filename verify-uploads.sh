#!/bin/bash

# Define S3 bucket
BUCKET="king-covy-assets"

echo "🔍 Verifying uploaded images in S3..."
echo "📦 Bucket: $BUCKET"
echo ""

# List of expected files
declare -a expected_files=(
  "products/drivers/titleist-tsr3-driver.jpg"
  "products/drivers/generic-driver.jpg"
  "products/putters/scotty-cameron-newport-2.jpg"
  "products/putters/generic-putter.jpg"
  "products/irons/mizuno-mp20-irons.jpg"
  "products/irons/generic-irons.jpg"
  "products/wedges/cleveland-rtx-6-wedge.jpg"
  "products/wedges/vokey-sm9-wedge-set.jpg"
  "products/fairway-woods/taylormade-stealth-2-fairway.jpg"
  "products/fairway-woods/generic-fairway-wood.jpg"
  "categories/drivers.jpg"
  "categories/putters.jpg"
  "categories/irons.jpg"
  "categories/wedges.jpg"
  "categories/fairway-woods.jpg"
  "categories/hybrids.jpg"
  "categories/accessories.jpg"
  "categories/collectibles.jpg"
  "brands/titleist-logo.png"
  "brands/callaway-logo.png"
  "brands/taylormade-logo.png"
  "brands/ping-logo.png"
  "brands/mizuno-logo.png"
  "brands/scotty-cameron-logo.png"
  "brands/odyssey-logo.png"
  "brands/cleveland-logo.png"
  "brands/bettinardi-logo.png"
  "brands/cobra-logo.png"
  "brands/wilson-logo.png"
  "brands/srixon-logo.png"
)

# Counter for tracking
total_files=${#expected_files[@]}
found_files=0
missing_files=0

echo "📊 Checking $total_files expected files..."
echo ""

for file in "${expected_files[@]}"; do
  if aws s3 ls "s3://$BUCKET/$file" > /dev/null 2>&1; then
    echo "✅ Found: $file"
    found_files=$((found_files + 1))
  else
    echo "❌ Missing: $file"
    missing_files=$((missing_files + 1))
  fi
done

echo ""
echo "📈 Summary:"
echo "   • Total files: $total_files"
echo "   • Found: $found_files"
echo "   • Missing: $missing_files"

if [ $missing_files -eq 0 ]; then
  echo ""
  echo "🎉 All files uploaded successfully!"
  echo ""
  echo "🔗 Test URLs:"
  echo "   • Product: https://$BUCKET.s3.amazonaws.com/products/drivers/titleist-tsr3-driver.jpg"
  echo "   • Category: https://$BUCKET.s3.amazonaws.com/categories/drivers.jpg"
  echo "   • Brand: https://$BUCKET.s3.amazonaws.com/brands/titleist-logo.png"
else
  echo ""
  echo "⚠️  Some files are missing. Please check the upload script."
fi
