# 🖼️ Image Upload Instructions

## 🎯 **Goal**: Automatically upload stock golf club images to S3

## 📋 **Prerequisites**

1. **AWS CLI Installed**: 
   ```bash
   # Check if installed
   aws --version
   
   # If not installed, install it:
   # macOS: brew install awscli
   # Linux: curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && sudo ./aws/install
   ```

2. **AWS Credentials Configured**:
   ```bash
   aws configure
   # Enter your AWS Access Key ID, Secret Access Key, region (us-east-1), output format (json)
   ```

3. **Test AWS Access**:
   ```bash
   aws sts get-caller-identity
   # Should return your AWS account info
   ```

## 🚀 **Quick Start**

### **Step 1: Run the Upload Script**
```bash
./upload-images.sh
```

### **Step 2: Verify Uploads**
```bash
./verify-uploads.sh
```

### **Step 3: Test URLs**
Open these URLs in your browser to verify:
- Product: https://king-covy-assets.s3.amazonaws.com/products/drivers/titleist-tsr3-driver.jpg
- Category: https://king-covy-assets.s3.amazonaws.com/categories/drivers.jpg
- Brand: https://king-covy-assets.s3.amazonaws.com/brands/titleist-logo.png

## 📁 **File Structure**

The script will create this structure in S3:

```
king-covy-assets.s3.amazonaws.com/
├── products/
│   ├── drivers/
│   │   ├── titleist-tsr3-driver.jpg
│   │   └── generic-driver.jpg
│   ├── putters/
│   │   ├── scotty-cameron-newport-2.jpg
│   │   └── generic-putter.jpg
│   ├── irons/
│   │   ├── mizuno-mp20-irons.jpg
│   │   └── generic-irons.jpg
│   ├── wedges/
│   │   ├── cleveland-rtx-6-wedge.jpg
│   │   └── vokey-sm9-wedge-set.jpg
│   └── fairway-woods/
│       ├── taylormade-stealth-2-fairway.jpg
│       └── generic-fairway-wood.jpg
├── categories/
│   ├── drivers.jpg
│   ├── putters.jpg
│   ├── irons.jpg
│   ├── wedges.jpg
│   ├── fairway-woods.jpg
│   ├── hybrids.jpg
│   ├── accessories.jpg
│   └── collectibles.jpg
└── brands/
    ├── titleist-logo.png
    ├── callaway-logo.png
    ├── taylormade-logo.png
    ├── ping-logo.png
    ├── mizuno-logo.png
    ├── scotty-cameron-logo.png
    ├── odyssey-logo.png
    ├── cleveland-logo.png
    ├── bettinardi-logo.png
    ├── cobra-logo.png
    ├── wilson-logo.png
    └── srixon-logo.png
```

## 🔧 **What the Script Does**

1. **Downloads** images from Unsplash URLs
2. **Uploads** them directly to S3 bucket `king-covy-assets`
3. **Sets** public-read permissions for CloudFront access
4. **Organizes** files into proper folder structure
5. **Provides** progress tracking and error handling

## 🛠️ **Troubleshooting**

### **AWS CLI Not Working**
```bash
# Check credentials
aws configure list

# Test access
aws s3 ls s3://king-covy-assets/
```

### **Upload Failures**
- Check internet connection
- Verify AWS permissions (need `s3:PutObject` permission)
- Check if bucket exists: `aws s3 ls s3://king-covy-assets/`

### **Images Not Showing**
- Check if files uploaded: `./verify-uploads.sh`
- Test direct S3 URLs in browser
- Invalidate CloudFront cache if using CDN

## 🔄 **Next Steps After Upload**

1. **Update Frontend**: Modify image URLs in components to use new S3 paths
2. **Update Database**: Change product records to point to new image URLs
3. **Test**: Verify images load on shop page and categories page
4. **CloudFront**: Invalidate cache if using CDN

## 📊 **Expected Results**

- **31 images** uploaded to S3
- **Clean placeholder images** instead of broken SVG placeholders
- **Organized folder structure** for easy management
- **Public access** for frontend consumption

## 🎉 **Success Indicators**

✅ All 31 files uploaded successfully  
✅ Direct S3 URLs work in browser  
✅ Images display on frontend  
✅ No more placeholder SVG overlays  

---

**Ready to run? Execute `./upload-images.sh` and let me know the results!**
