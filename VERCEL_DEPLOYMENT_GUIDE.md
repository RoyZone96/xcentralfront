# 🚀 Vercel Deployment Guide - XCentral Front

## 📋 **Prerequisites**

1. **GitHub Repository**: Ensure your code is pushed to GitHub
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Backend API**: Your backend is deployed at `https://xcentralback.onrender.com`

## 🔧 **Step 1: Prepare Your Project**

### 1.1 Verify API Configuration

Your project is already configured to use the production backend:

```javascript
// src/config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://xcentralback.onrender.com';
export { API_BASE_URL };
```

✅ **No environment variables needed** - uses production backend by default!

### 1.2 Update Service Files to Use Config

Replace hardcoded URLs in your service files:

```javascript
// In UserAuthService.js, FlaggedSubmissions.js, etc.
import { API_BASE_URL } from '../config/api';

// Replace: http://localhost:8080
// With: API_BASE_URL
```

### 1.3 Create Vercel Configuration

Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "s-maxage=31536000,immutable"
      },
      "dest": "/static/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## 🌐 **Step 2: Deploy to Vercel**

### Option A: Vercel CLI (Recommended)

1. **Fix package dependencies first**:
   ```powershell
   npm install
   ```

2. **Install Vercel CLI**:
   ```powershell
   npm install -g vercel
   ```

3. **Login to Vercel**:
   ```powershell
   vercel login
   ```

4. **Deploy from your project directory**:
   ```powershell
   cd "c:\Projects\Personal Projects\xcentralfront"
   vercel --prod
   ```

### Option B: GitHub Integration (Automatic)

1. **Push your code to GitHub**:
   ```powershell
   git add .
   git commit -m "Fix deployment: Remove env-cmd dependency"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Deploy with default settings

## 🔐 **Step 3: Configure Environment Variables**

### 3.1 In Vercel Dashboard

1. **Go to your project settings**
2. **Navigate to "Environment Variables"**
3. **Add the following variables**:

   | Name | Value | Environment |
   |------|-------|-------------|
   | `REACT_APP_API_URL` | `https://your-backend-api.com` | Production |
   | `REACT_APP_API_URL` | `https://staging-api.com` | Preview |
   | `REACT_APP_API_URL` | `http://localhost:8080` | Development |

### 3.2 Example Environment Variables

```env
# Production
REACT_APP_API_URL=https://xcentralapi.herokuapp.com

# Development  
REACT_APP_API_URL=http://localhost:8080

# Optional: Analytics, etc.
REACT_APP_GA_TRACKING_ID=your-ga-id
REACT_APP_SENTRY_DSN=your-sentry-dsn
```

## ⚙️ **Step 4: Custom Build Configuration**

### 4.1 Update package.json Scripts

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "vercel-build": "npm run build"
  }
}
```

### 4.2 Create Build Optimization

Create `.vercelignore`:

```gitignore
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build

# Misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/

# OS
Thumbs.db
```

## 🔄 **Step 5: Set Up Automatic Deployments**

### 5.1 Git Integration

Vercel automatically deploys when you push to GitHub:

- **Production**: Pushes to `main` branch
- **Preview**: Pushes to other branches or PRs

### 5.2 Deployment Commands

```powershell
# Push changes to trigger deployment
git add .
git commit -m "Deploy to production"
git push origin main

# Create feature branch for preview
git checkout -b feature/new-feature
git push origin feature/new-feature
```

## 🌍 **Step 6: Custom Domain (Optional)**

### 6.1 Add Custom Domain

1. **In Vercel Dashboard** → **Domains**
2. **Add Domain**: `yourdomain.com`
3. **Configure DNS**:
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

### 6.2 SSL Certificate

Vercel automatically provides SSL certificates for all domains.

## 🔍 **Step 7: Performance & SEO Optimization**

### 7.1 Add Meta Tags

Update `public/index.html`:

```html
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="XCentral - Beyblade Tournament Management" />
  <meta name="keywords" content="beyblade, tournament, competition, ranking" />
  <meta property="og:title" content="XCentral - Beyblade Tournament Management" />
  <meta property="og:description" content="Manage your Beyblade tournaments and track rankings" />
  <meta property="og:type" content="website" />
  <title>XCentral - Beyblade Tournament Management</title>
</head>
```

### 7.2 Add Sitemap

Create `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yoursite.vercel.app/</loc>
    <lastmod>2025-07-18</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yoursite.vercel.app/login</loc>
    <lastmod>2025-07-18</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

## 📊 **Step 8: Monitoring & Analytics**

### 8.1 Vercel Analytics

Add to your project:

```javascript
// src/index.js
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div>
      {/* Your app */}
      <Analytics />
    </div>
  );
}
```

Install the package:
```powershell
npm install @vercel/analytics
```

### 8.2 Error Monitoring

Set up error boundaries and monitoring:

```javascript
// src/components/ErrorBoundary.js
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## 🚀 **Step 9: Deploy Commands Summary**

### Initial Deployment
```powershell
# Ensure you're in the project directory
cd "c:\Projects\Personal Projects\xcentralfront"

# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set production alias (if needed)
vercel --prod
```

### Subsequent Deployments
```powershell
# Just push to GitHub - Vercel auto-deploys
git add .
git commit -m "Update: [describe changes]"
git push origin main
```

## 📝 **Step 10: Post-Deployment Checklist**

- [ ] **Test all routes** work correctly
- [ ] **API calls** connect to production backend
- [ ] **Authentication flow** works end-to-end
- [ ] **Admin functionality** operates properly
- [ ] **Mobile responsiveness** is maintained
- [ ] **Performance scores** are acceptable (use Lighthouse)
- [ ] **Error handling** displays properly
- [ ] **SSL certificate** is active
- [ ] **Custom domain** (if applicable) resolves correctly

## 🔧 **Troubleshooting**

### Common Issues

1. **Build Fails**:
   ```powershell
   # Check build locally
   npm run build
   ```

2. **API Connection Issues**:
   - Verify `REACT_APP_API_URL` environment variable
   - Check CORS settings on backend
   - Ensure backend is deployed and accessible

3. **Routing Issues**:
   - Verify `vercel.json` configuration
   - Check React Router setup

4. **Environment Variables Not Working**:
   - Variables must start with `REACT_APP_`
   - Redeploy after adding variables

## 📞 **Support Resources**

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **React Deployment**: [create-react-app.dev/docs/deployment](https://create-react-app.dev/docs/deployment/)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

## 🎉 **Your XCentral App is Now Live!**

After following these steps, your Beyblade tournament management application will be live on Vercel with:

✅ **Automatic deployments** from GitHub  
✅ **Global CDN** for fast loading  
✅ **SSL certificate** for security  
✅ **Environment-based configuration**  
✅ **Production-ready performance**  

**Your app will be accessible at**: `https://xcentralfront.vercel.app` (or your custom domain)
