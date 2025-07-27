// Image Configuration for Easy Management
// Update these URLs when you want to change images

export const IMAGES = {
  // Hero section background
  hero: "https://customer-assets.emergentagent.com/job_084c46c7-ef05-4cad-8a4b-239666920808/artifacts/xqz1vx3e_IMG_8977.jpg",
  
  // About section portrait
  about: "https://customer-assets.emergentagent.com/job_084c46c7-ef05-4cad-8a4b-239666920808/artifacts/tbun0xgt_IMG_20211120_094046_597.jpg",
  
  // Yoga section images
  yoga1: "https://customer-assets.emergentagent.com/job_084c46c7-ef05-4cad-8a4b-239666920808/artifacts/hysim7o4_IMG-20220220-WA0031.jpg",
  yoga2: "https://customer-assets.emergentagent.com/job_084c46c7-ef05-4cad-8a4b-239666920808/artifacts/kewatv5s_IMG-20220317-WA0018.jpg",
  
  // Volunteering section image
  volunteering: "https://customer-assets.emergentagent.com/job_084c46c7-ef05-4cad-8a4b-239666920808/artifacts/a1kaloiv_IMG_20220206_170738_767.jpg",
  
  // Placeholder for additional images
  // portfolio1: "https://your-image-host.com/portfolio1.jpg",
  // portfolio2: "https://your-image-host.com/portfolio2.jpg",
  // video_thumbnail: "https://your-image-host.com/video-thumb.jpg",
};

// Alternative image hosts you can use:
export const IMAGE_HOSTING_OPTIONS = {
  cloudinary: "https://res.cloudinary.com/your-cloud-name/image/upload/",
  imagekit: "https://ik.imagekit.io/your-imagekit-id/",
  imgur: "https://i.imgur.com/",
  github: "/images/", // If using public folder
  unsplash: "https://images.unsplash.com/", // For stock photos
};

// Image optimization settings
export const IMAGE_SETTINGS = {
  // Recommended sizes for different sections
  hero: { width: 1920, height: 1080, quality: 85 },
  about: { width: 800, height: 1000, quality: 90 },
  yoga: { width: 600, height: 400, quality: 85 },
  portfolio: { width: 500, height: 300, quality: 80 },
  thumbnail: { width: 300, height: 200, quality: 75 },
};

// Helper function to generate responsive image URLs (for Cloudinary)
export const getResponsiveImage = (imageName, size = 'medium') => {
  const sizes = {
    small: 'w_400,q_auto,f_auto',
    medium: 'w_800,q_auto,f_auto', 
    large: 'w_1200,q_auto,f_auto',
    hero: 'w_1920,q_auto,f_auto'
  };
  
  // Replace with your Cloudinary cloud name
  const cloudName = "your-cloud-name";
  return `https://res.cloudinary.com/${cloudName}/image/upload/${sizes[size]}/${imageName}`;
};

export default IMAGES;