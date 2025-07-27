# 📝 Content Editing Guide

## 🎯 Quick Edit Locations

### 📍 Main Homepage Content
**File:** `/app/frontend/src/pages/Homepage.jsx`

#### Hero Section (Lines 135-155)
```jsx
<h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight">
  Where Capital Meets
  <span className="block text-[#FFD447]">Consciousness</span>
</h1>
<p className="text-xl md:text-2xl mb-8 opacity-90">
  Private Equity Investor | Yoga Teacher | Lifelong Learner
</p>
```

#### About Section (Lines 175-195)
```jsx
<p>Hi, I'm Pranay.</p>
<p>
  I wear two very different hats — and yet, they feel completely aligned...
</p>
```

#### Yoga Section Quote (Lines 210-215)
```jsx
<Quote className="h-8 w-8 mr-3 opacity-50" />
"The body is the entry point. The breath is the guide. The self is what you meet."
```

#### Investment Section (Lines 280-290)
```jsx
<p>
  I'm a Vice President at Lok Capital, focusing on impact-driven investments...
</p>
```

#### Contact Information (Lines 680-690)
```jsx
<span className="text-gray-600">pranaysultania6@gmail.com</span>
<span className="text-gray-600">+91 81056 57505</span>
```

---

## 🖼️ Image Management System

### Current Image Locations
**File:** `/app/frontend/src/pages/Homepage.jsx`

1. **Hero Background** (Line ~140):
   ```jsx
   backgroundImage: `url('https://customer-assets.emergentagent.com/job_084c46c7-ef05-4cad-8a4b-239666920808/artifacts/xqz1vx3e_IMG_8977.jpg')`
   ```

2. **About Portrait** (Line ~185):
   ```jsx
   src="https://customer-assets.emergentagent.com/job_084c46c7-ef05-4cad-8a4b-239666920808/artifacts/tbun0xgt_IMG_20211120_094046_597.jpg"
   ```

3. **Yoga Images** (Lines ~250, ~270):
   ```jsx
   src="https://customer-assets.emergentagent.com/job_084c46c7-ef05-4cad-8a4b-239666920808/artifacts/hysim7o4_IMG-20220220-WA0031.jpg"
   src="https://customer-assets.emergentagent.com/job_084c46c7-ef05-4cad-8a4b-239666920808/artifacts/kewatv5s_IMG-20220317-WA0018.jpg"
   ```

4. **Volunteering Image** (Line ~385):
   ```jsx
   src="https://customer-assets.emergentagent.com/job_084c46c7-ef05-4cad-8a4b-239666920808/artifacts/a1kaloiv_IMG_20220206_170738_767.jpg"
   ```

### 🔄 How to Replace Images

#### Option 1: Using External Hosting (Recommended)
1. **Upload to Cloudinary/ImageKit/Imgur**
2. **Get the public URL**
3. **Replace in code:**
   ```jsx
   // Old
   src="https://old-image-url.jpg"
   
   // New  
   src="https://your-new-image-url.jpg"
   ```

#### Option 2: Using GitHub Repository
1. **Create folder:** `/app/frontend/public/images/`
2. **Add images:** `hero.jpg`, `about.jpg`, `yoga1.jpg`, etc.
3. **Update code:**
   ```jsx
   // Instead of external URL
   src="/images/hero.jpg"
   ```

#### Option 3: Modern Image Management (Advanced)
```jsx
// Create images constant file
const IMAGES = {
  hero: "https://your-cdn.com/hero.jpg",
  about: "https://your-cdn.com/about.jpg",
  yoga1: "https://your-cdn.com/yoga1.jpg",
  yoga2: "https://your-cdn.com/yoga2.jpg",
  volunteering: "https://your-cdn.com/volunteering.jpg"
};

// Use in components
<img src={IMAGES.hero} alt="Hero" />
```

---

## 📱 Adding Video Support

### YouTube/Vimeo Embed
```jsx
// Add to any section
<div className="aspect-video">
  <iframe 
    src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
    className="w-full h-full rounded-lg"
    allowFullScreen
  />
</div>
```

### HTML5 Video
```jsx
<video 
  className="w-full rounded-lg shadow-lg"
  controls
  poster="/images/video-thumbnail.jpg"
>
  <source src="/videos/your-video.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

---

## 🎨 Styling & Colors

### Color Palette (Already Defined)
- **Primary Teal:** `#007C91`
- **Fresh Green:** `#8FCB9B` 
- **Soft Yellow:** `#FFD447`

### Usage in Code
```jsx
// Background colors
className="bg-[#007C91]"

// Text colors  
className="text-[#8FCB9B]"

// Border colors
className="border-[#FFD447]"
```

---

## 📝 Static Data Updates

### Yoga Offerings (Lines ~50-80 in mock.js)
```javascript
export const mockYogaOfferings = [
  {
    title: "Private Sessions",
    description: "Personalized one-on-one yoga sessions...",
    duration: "60-90 minutes",
    format: "In-person or online",
    price: "Contact for pricing"
  }
  // Add more offerings here
];
```

### Investment Portfolio (Lines ~100-130 in mock.js)
```javascript
export const mockInvestments = [
  {
    company: "GrowXCD",
    sector: "Financial Services", 
    description: "Innovative credit solutions...",
    status: "Active"
  }
  // Update with your actual investments
];
```

### Volunteering Initiatives (Lines ~140-170 in mock.js)
```javascript
export const mockVolunteeringInitiatives = [
  {
    organization: "Headstart Network Foundation",
    role: "Mentor & Strategic Advisor",
    focus: "Supporting early-stage entrepreneurs..."
  }
  // Update with your current initiatives
];
```

---

## 🔧 Quick Edit Checklist

### ✅ Essential Updates
- [ ] **Personal Details:** Name, title, bio
- [ ] **Contact Info:** Email, phone, social links
- [ ] **Professional Info:** Current role, company details
- [ ] **Images:** Replace with your actual photos
- [ ] **Content:** Update all sections with current information

### ✅ Optional Enhancements
- [ ] **Videos:** Add yoga practice videos
- [ ] **Blog Posts:** Use admin dashboard for regular updates
- [ ] **Testimonials:** Update with real client feedback
- [ ] **Portfolio:** Add recent investment/project details

---

## 🚀 Publishing Changes

After editing content:

1. **Save files** (hot reload will show changes locally)
2. **Test locally** at `http://localhost:3000`
3. **Deploy updates:**
   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```
4. **Vercel auto-deploys** your changes

Your live website will update within 1-2 minutes! 
🌐 **Share your portfolio:** `https://your-vercel-url.vercel.app`