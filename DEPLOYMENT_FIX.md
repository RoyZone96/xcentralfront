# 🚨 DEPLOYMENT FIX - Run These Commands

## Problem: npm ci fails due to env-cmd dependency mismatch

## ✅ Solution: Run these commands in order

```powershell
# 1. Navigate to project directory
cd "c:\Projects\Personal Projects\xcentralfront"

# 2. Remove problematic lock file and node_modules
rm -rf node_modules package-lock.json

# 3. Clean install dependencies (this will create new lock file)
npm install

# 4. Test build locally
npm run build

# 5. Commit the fixes
git add .
git commit -m "Fix deployment: Remove env-cmd dependency and sync lock file"
git push origin main
```

## 🎯 What was fixed:

- ❌ Removed `env-cmd` from devDependencies
- ❌ Removed custom build scripts that used env-cmd
- ✅ Simplified package.json to only essential scripts
- ✅ Uses production backend URL directly from config

## 🚀 Result:

Your app now connects to `https://xcentralback.onrender.com` by default and will deploy successfully to Vercel!

**No environment variables needed** - everything is configured automatically! 🎉
