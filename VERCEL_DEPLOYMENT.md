# Vercel Deployment Guide for MediSync

## ✅ Your project is already configured for Vercel!

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to [https://vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"Add New Project"**
4. Import your repository: `2420090149-klh/MEDI-SYNC`
5. Vercel will auto-detect settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **"Deploy"**

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

## 🔧 Current Configuration

### vercel.json
```json
{
  "version": 2,
  "builds": [
    { 
      "src": "package.json", 
      "use": "@vercel/static-build", 
      "config": { "distDir": "dist" } 
    }
  ],
  "routes": [
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

This configuration:
- ✅ Uses static build for Vite
- ✅ Sets output directory to `dist`
- ✅ Redirects all routes to index.html (for React Router)

## 🚀 After Deployment

Your app will be live at:
- Production: `https://medi-sync-[your-id].vercel.app`
- Custom domain: Can be configured in Vercel dashboard

## 🔄 Automatic Deployments

Every push to `main` branch will trigger:
- Automatic build on Vercel
- Preview deployments for PRs

## 📝 Environment Variables (Optional)

If needed, add in Vercel Dashboard → Settings → Environment Variables:
- `VITE_API_URL` - Your API endpoint
- `VITE_GOOGLE_CLIENT_ID` - For Google OAuth
- etc.

## ✨ Features Included

- ✅ 6 languages (EN, HI, TE, TA, KN, BHO)
- ✅ Text-to-speech in native languages
- ✅ Responsive design
- ✅ Accessibility toolbar
- ✅ Authentication system
- ✅ Calendar & booking system
