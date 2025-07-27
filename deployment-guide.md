# 🚀 Deployment Guide for Pranay's Portfolio

## Prerequisites
1. **GitHub Account** - To store your code
2. **Vercel Account** - For frontend deployment (free)
3. **Railway Account** - For backend + database deployment (free tier available)

## Step 1: Deploy Backend to Railway

### 1.1 Setup Railway
1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project"
3. Choose "Deploy from GitHub repo"
4. Connect your GitHub account and select your portfolio repository

### 1.2 Configure Backend Service
1. Railway will detect your backend automatically
2. Add these environment variables in Railway dashboard:
   ```
   MONGO_URL=mongodb://mongo:27017
   DB_NAME=pranay_portfolio
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=pranay2024
   ```
3. Railway will provide a URL like: `https://your-app-railway.up.railway.app`

### 1.3 Add MongoDB Database
1. In Railway dashboard, click "New Service"
2. Choose "MongoDB" from templates
3. Railway will automatically configure the connection

## Step 2: Deploy Frontend to Vercel

### 2.1 Setup Vercel
1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "New Project"
3. Import your repository
4. Choose the `frontend` folder as root directory

### 2.2 Configure Environment Variables
In Vercel dashboard, add:
```
REACT_APP_BACKEND_URL=https://your-railway-backend-url.up.railway.app
```

### 2.3 Build Settings
- **Framework Preset:** Create React App
- **Root Directory:** frontend
- **Build Command:** `npm run build`
- **Output Directory:** build

## Step 3: Update Frontend Configuration

Once you have your Railway backend URL, update your frontend:

```bash
# In your local frontend/.env file
REACT_APP_BACKEND_URL=https://your-railway-backend-url.up.railway.app
```

Then redeploy to Vercel.

## Step 4: Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain (e.g., `pranaysultania.com`)

### For Railway (Backend):
1. Go to project settings
2. Click "Domains"
3. Add custom domain for API (e.g., `api.pranaysultania.com`)

## 🔧 Quick Deploy Commands

After setting up the services, you can deploy updates:

```bash
# Deploy frontend changes
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys

# Deploy backend changes  
git add .
git commit -m "Update backend"
git push origin main
# Railway auto-deploys
```

## 🌐 Your Live URLs

After deployment, you'll have:
- **Website:** `https://your-vercel-app.vercel.app`
- **Admin Dashboard:** `https://your-vercel-app.vercel.app/admin`
- **API:** `https://your-railway-app.up.railway.app/api`

## 🛠 Troubleshooting

### Common Issues:
1. **CORS Errors:** Ensure backend allows your frontend domain
2. **Database Connection:** Check MongoDB connection string
3. **Build Failures:** Check all dependencies are listed in package.json/requirements.txt
4. **Environment Variables:** Ensure all required vars are set in both services

### Health Checks:
- **Backend:** Visit `https://your-railway-url/api/`
- **Database:** Check Railway MongoDB logs
- **Frontend:** Visit your Vercel URL

## 💡 Next Steps After Deployment

1. **Custom Domain:** Set up your own domain name
2. **SSL Certificate:** Both Vercel and Railway provide free SSL
3. **Analytics:** Add Google Analytics to track visitors
4. **SEO:** Update meta tags and descriptions
5. **Performance:** Monitor loading times and optimize

Your portfolio will be live and accessible to share with clients and collaborators!