# Deployment Guide

## Overview
This guide covers the CI/CD pipeline setup for seamless production deployments of the XCentral Front application.

## CI/CD Pipeline

### Branches Strategy
- **main**: Production-ready code, automatically deploys to staging
- **develop**: Development branch for feature integration
- **feature/***: Feature branches, trigger CI checks

### Automated Workflows

#### 1. Continuous Integration (CI)
**Triggers**: Push to main/develop, Pull Requests
**File**: `.github/workflows/ci.yml`

**Steps**:
- ✅ Code linting with ESLint
- ✅ Unit tests with coverage
- ✅ Build verification
- ✅ Security audit
- ✅ Multi-Node.js version testing (18.x, 20.x)

#### 2. Continuous Deployment (CD)
**Triggers**: Push to main, GitHub releases
**File**: `.github/workflows/deploy.yml`

**Environments**:
- **Staging**: Auto-deploy on main branch push
- **Production**: Deploy on GitHub release creation

#### 3. Dependency Updates
**Triggers**: Weekly schedule (Mondays 9 AM UTC), Manual
**File**: `.github/workflows/dependency-updates.yml`

**Features**:
- Automated dependency updates
- Security vulnerability fixes
- Test validation
- Auto-creates Pull Request

## Quick Start

### 1. Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd xcentralfront

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### 2. Local Development
```bash
# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

### 3. Docker Deployment
```bash
# Build Docker image
npm run docker:build

# Run with Docker Compose
npm run docker:compose
```

## Environment Configuration

### Environment Files
- `.env.local` - Local development
- `.env.staging` - Staging environment
- `.env.production` - Production environment

### Required Environment Variables
```env
REACT_APP_API_URL=<backend-api-url>
REACT_APP_ENVIRONMENT=<environment>
```

## Production Deployment

### Option 1: Automated (Recommended)
1. **Staging Deployment**:
   ```bash
   git push origin main
   ```
   - Automatically deploys to staging
   - Runs full test suite
   - Creates staging build

2. **Production Deployment**:
   ```bash
   # Create and push a release tag
   git tag v1.0.0
   git push origin v1.0.0
   
   # Or create release via GitHub UI
   ```

### Option 2: Manual Docker Deployment
```bash
# Build for production
npm run build:production

# Build Docker image
docker build -t xcentralfront:latest .

# Run container
docker run -p 3000:80 xcentralfront:latest
```

## GitHub Secrets Configuration

### Required Secrets
```
STAGING_API_URL=https://staging-api.yourdomain.com
PRODUCTION_API_URL=https://api.yourdomain.com
```

### Optional Secrets (for enhanced deployments)
```
SLACK_WEBHOOK_URL=<slack-notification-url>
DOCKER_HUB_USERNAME=<dockerhub-username>
DOCKER_HUB_TOKEN=<dockerhub-token>
```

## Monitoring & Health Checks

### Health Endpoints
- **Application**: `http://localhost:3000/health`
- **Docker**: Built-in health checks every 30s

### Error Monitoring
- Console error tracking in production
- Failed deployment notifications
- Security audit alerts

## Rollback Strategy

### Quick Rollback
```bash
# Revert to previous release
git revert <commit-hash>
git push origin main

# Or redeploy previous tag
git checkout v1.0.0
git tag v1.0.1
git push origin v1.0.1
```

### Emergency Rollback
1. Access GitHub repository
2. Go to Actions tab
3. Re-run previous successful deployment

## Security Considerations

- ✅ Automated security audits
- ✅ Dependency vulnerability scanning  
- ✅ Secure environment variable handling
- ✅ HTTPS enforcement in production
- ✅ Security headers via Nginx
- ✅ Content Security Policy

## Performance Optimizations

- ✅ Multi-stage Docker builds
- ✅ Nginx gzip compression
- ✅ Static asset caching
- ✅ Build artifact optimization
- ✅ CDN-ready static files

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   npm run build
   
   # Clear cache
   npm ci
   ```

2. **Docker Issues**
   ```bash
   # Check container logs
   docker logs <container-id>
   
   # Rebuild image
   docker build --no-cache -t xcentralfront .
   ```

3. **Environment Variables**
   ```bash
   # Verify environment loading
   npm run build:staging
   ```

### Support
- Check GitHub Actions logs for deployment issues
- Review container health check status
- Monitor application logs in production

## Development Workflow

### Feature Development
1. Create feature branch: `git checkout -b feature/new-feature`
2. Develop and test locally
3. Push branch: `git push origin feature/new-feature`
4. Create Pull Request to `develop`
5. CI runs automatically
6. Merge after approval

### Release Process
1. Merge `develop` to `main`
2. Staging deployment triggers automatically
3. Test staging environment
4. Create GitHub release for production deployment

This setup ensures reliable, automated deployments with proper testing and rollback capabilities.
