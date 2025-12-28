# Deployment Guide

This document provides detailed deployment instructions for Garhwali Seva on various platforms.

## Table of Contents

1. [Vercel (Recommended)](#vercel-recommended)
2. [Render (Docker)](#render-docker)
3. [Docker (Generic)](#docker-generic)
4. [AWS Amplify](#aws-amplify)
5. [Netlify](#netlify)
6. [ Railway](#railway)

---

## Vercel (Recommended)

Vercel is the creators of Next.js and offers the best deployment experience.

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fgarhwali-seva)

### Manual Deployment

1. **Install Vercel CLI**

```bash
npm i -g vercel
```

2. **Login to Vercel**

```bash
vercel login
```

3. **Deploy**

```bash
vercel
```

Follow the interactive prompts. Vercel will auto-detect Next.js settings.

### Configuration

No configuration needed - `vercel.json` handles all settings.

### Environment Variables

Not required for basic deployment. Optional variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_APP_URL` | Production URL | No |

### Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Configure DNS as instructed

---

## Render (Docker)

Render offers reliable hosting with Docker support.

### Prerequisites

- [Render](https://render.com/) account
- GitHub repository connected

### Deployment Steps

1. **Create Web Service**

   - Go to Render Dashboard
   - Click "New" → "Web Service"

2. **Connect Repository**

   - Select your GitHub repository
   - Click "Connect"

3. **Configure Service**

   | Setting | Value |
   |---------|-------|
   | Build Command | `npm install` |
   | Start Command | `npm run start` |
   | Environment | `Node` |
   | Instance Type | `Free` or `Starter` |

4. **Advanced Options**

   - Expand "Advanced"
   - Add any environment variables
   - Set Node version: `18`

5. **Deploy**

   - Click "Create Web Service"
   - Wait for build and deployment

### Health Check

Render will automatically check the `/api/health` endpoint.

---

## Docker (Generic)

Deploy on any platform that supports Docker.

### Build Image

```bash
docker build -t garhwali-seva:latest .
```

### Run Container

```bash
docker run -p 3000:3000 garhwali-seva:latest
```

### Environment Variables

Create `.env` file:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Docker Compose (Production)

```bash
docker-compose -f docker-compose.yml up app-prod -d
```

---

## AWS Amplify

### Prerequisites

- AWS Account
- GitHub repository

### Steps

1. **Create App**

   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Select GitHub → Continue

2. **Configure Build**

   Amplify auto-detects Next.js. Settings:

   | Setting | Value |
   |---------|-------|
   | Build Image | Node 18 |
   | Build Command | `npm install && npm run build` |
   | Start Command | `npm run start` |

3. **Add Environment Variables**

   - Go to "Environment variables"
   - Add any variables from `.env.example`

4. **Deploy**

   - Click "Save and deploy"
   - Wait for build to complete

---

## Netlify

### Prerequisites

- [Netlify](https://netlify.com/) account

### One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/garhwali-seva)

### Manual Deployment

1. **Install Netlify CLI**

```bash
npm i -g netlify-cli
```

2. **Login**

```bash
netlify login
```

3. **Deploy**

```bash
netlify deploy --prod
```

### Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm install && npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"
```

---

## Railway

### Prerequisites

- [Railway](https://railway.app/) account

### Deployment Steps

1. **Create Project**

   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Configure Service**

   - Select your repository
   - Choose "Web Service"

3. **Settings**

   | Setting | Value |
   |---------|-------|
   | Build Command | `npm install` |
   | Start Command | `npm run start` |
   | Root Directory | `/` |

4. **Deploy**

   - Click "Deploy"
   - Wait for completion

---

## Verification Checklist

After deployment, verify:

- [ ] Homepage loads at `/`
- [ ] Text translator works
- [ ] Song translator works at `/songs`
- [ ] Contribute page accessible at `/contribute`
- [ ] Health check returns 200 at `/api/health`
- [ ] Dark mode toggles correctly
- [ ] Mobile responsive

---

## Troubleshooting

### Build Fails

**Error**: Out of memory
**Solution**: Add `NODE_OPTIONS: "--max-old-space-size=4096"` to build environment

### 500 Error on Load

**Error**: Module not found
**Solution**: Ensure all dependencies installed: `npm install`

### Images Not Loading

**Error**: 404 for images
**Solution**: Check `next.config.js` image domains configuration

### API Not Working

**Error**: 404 for API routes
**Solution**: Ensure routes are in `app/api/` directory

---

## Performance Optimization

### Vercel (Automatic)

- Edge caching enabled
- Automatic image optimization
- Minified JavaScript

### Self-Hosted

Enable optimizations in `next.config.js`:

```javascript
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
  compress: true,
};
```

---

## Monitoring

### Vercel Analytics

Enable in project settings for:
- Web Vitals
- Request metrics
- Function execution

### Health Checks

The `/api/health` endpoint returns:

```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

---

## Rollback

### Vercel

1. Go to Deployments
2. Find previous working deployment
3. Click "Promote to Production"

### Docker

```bash
docker tag garhwali-seva:latest garhwali-seva:v1
# Deploy v1 tag
```
