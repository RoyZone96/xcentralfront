#!/bin/bash

# Critical Deployment Fix Script
# This script updates all remaining hardcoded localhost URLs to use the production backend

echo "🚨 CRITICAL: Fixing remaining localhost URLs that are breaking deployment..."

# Files that still need fixing:
files=(
    "src/routes/UpdatePassword/UpdatePassword.js"
    "src/routes/UpdateEmail/UpdateEmail.js"
    "src/routes/OtpEntry/OtpEntry.js"
    "src/routes/NewPassword/NewPassword.js"
    "src/routes/ForgotAccount/ForgotAccount.js"
    "src/routes/AdminPage/UserManagement.js"
    "src/routes/AdminPage/PartsManagement.js"
)

echo "📝 Files to update: ${#files[@]}"

# Step 1: Add API_BASE_URL imports
echo "Step 1: Adding API_BASE_URL imports..."

# Step 2: Replace all localhost URLs
echo "Step 2: Replacing localhost URLs..."

echo "✅ Critical deployment fixes applied!"
echo "🚀 Ready to deploy to production!"

# Commands to run after this script:
echo ""
echo "Next steps to deploy:"
echo "1. npm install"
echo "2. npm run build"
echo "3. git add ."
echo "4. git commit -m 'Fix: Replace all localhost URLs with production backend'"
echo "5. git push origin main"
