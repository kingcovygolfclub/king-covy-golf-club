# Stock Images Collection Plan

## 🎯 **Goal**: Replace all placeholder images with appropriate stock images

## 📍 **Locations Needing Images**

### **1. Shop Page - Product Cards**
- **Scotty Cameron Newport 2** (Putter)
- **Titleist TSR3 Driver** (Driver)
- **Mizuno MP-20 Irons** (Irons)
- **TaylorMade Stealth 2 Fairway Wood** (Fairway Wood)
- **Cleveland RTX 6 Wedge** (Wedge)
- **Vokey SM9 Wedge Set** (Wedges)
- **Test Products** (Generic golf clubs)

### **2. Categories Page - Category Images**
- **Drivers** category image
- **Irons** category image
- **Putters** category image
- **Wedges** category image
- **Fairway Woods** category image
- **Hybrids** category image
- **Accessories** category image
- **Collectibles** category image

### **3. Categories Page - Featured Brands**
- **Titleist** logo
- **Callaway** logo
- **TaylorMade** logo
- **Ping** logo
- **Mizuno** logo
- **Scotty Cameron** logo
- **Odyssey** logo
- **Cleveland** logo
- **Bettinardi** logo
- **Cobra** logo
- **Wilson** logo
- **Srixon** logo

### **4. Home Page**
- **Featured Products** section
- **Hero section** background
- **Category previews**

## 🖼️ **Image Requirements**

### **Product Images**
- **Size**: 400x300px (4:3 aspect ratio)
- **Format**: JPG or PNG
- **Style**: Clean, professional, white/neutral background
- **Content**: Specific golf club types (driver, putter, iron, wedge, etc.)

### **Category Images**
- **Size**: 400x300px
- **Format**: JPG or PNG
- **Style**: Represent the category (multiple clubs of that type)
- **Content**: Golf clubs grouped by type

### **Brand Logos**
- **Size**: 200x100px (2:1 aspect ratio)
- **Format**: PNG with transparent background
- **Style**: Official brand logos
- **Content**: Company logos only

## 📋 **Action Plan**

1. **Find Free Stock Images** from:
   - Unsplash.com
   - Pexels.com
   - Pixabay.com
   - Freepik.com (free tier)

2. **Download and Organize** by:
   - Product type
   - Category
   - Brand

3. **Upload to S3** in organized folders:
   - `/products/drivers/`
   - `/products/putters/`
   - `/products/irons/`
   - `/products/wedges/`
   - `/products/fairway-woods/`
   - `/categories/`
   - `/brands/`

4. **Update Database** to point to new image URLs

5. **Update Frontend** to use new image URLs

## 🔍 **Search Terms for Stock Images**

### **Product Images**
- "golf driver isolated white background"
- "golf putter isolated white background"
- "golf iron isolated white background"
- "golf wedge isolated white background"
- "golf fairway wood isolated white background"

### **Category Images**
- "golf drivers collection"
- "golf putters collection"
- "golf irons set"
- "golf wedges collection"
- "golf fairway woods set"

### **Brand Logos**
- "Titleist logo PNG"
- "Callaway logo PNG"
- "TaylorMade logo PNG"
- "Ping logo PNG"
- "Mizuno logo PNG"
- "Scotty Cameron logo PNG"

## 📁 **File Structure**
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
│   │   └── generic-wedge.jpg
│   └── fairway-woods/
│       ├── taylormade-stealth-2-fairway.jpg
│       └── generic-fairway-wood.jpg
├── categories/
│   ├── drivers.jpg
│   ├── putters.jpg
│   ├── irons.jpg
│   ├── wedges.jpg
│   └── fairway-woods.jpg
└── brands/
    ├── titleist-logo.png
    ├── callaway-logo.png
    ├── taylormade-logo.png
    ├── ping-logo.png
    ├── mizuno-logo.png
    └── scotty-cameron-logo.png
```
