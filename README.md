# HiLabs Frontend - Repository Ready

This frontend is now configured to work as a **separate repository** and can call the backend from any URL.

## 🚀 Quick Start

### Local Development
```bash
# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

The app will run on http://localhost:3000

### With Docker
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build manually
docker build -t hilabs-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8000 hilabs-frontend
```

## 🔧 Configuration

### Environment Variables

**Local Development (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Production (.env.production):**
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### API Configuration

The frontend uses a centralized API configuration in `lib/api-config.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

All API calls now use this dynamic URL instead of hardcoded localhost.

## 📁 Repository Structure

```
dash-hilabs/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/
│   └── api-config.ts      # API configuration
├── .env.local             # Local environment
├── .env.example           # Environment template
├── .env.production        # Production environment
├── docker-compose.yml     # Frontend Docker setup
├── Dockerfile             # Docker configuration
├── package.json           # Dependencies
└── README.md             # This file
```

## 🌐 Deployment Scenarios

### Scenario 1: Same Domain
```
Frontend: https://yourdomain.com
Backend:  https://yourdomain.com/api
```
**Environment:** `NEXT_PUBLIC_API_URL=https://yourdomain.com/api`

### Scenario 2: Separate Subdomains
```
Frontend: https://app.yourdomain.com
Backend:  https://api.yourdomain.com
```
**Environment:** `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`

### Scenario 3: Different Domains
```
Frontend: https://frontend-app.com
Backend:  https://backend-service.com
```
**Environment:** `NEXT_PUBLIC_API_URL=https://backend-service.com`

### Scenario 4: Cloud Services
```
Frontend: https://your-app.vercel.app (Vercel)
Backend:  https://your-app.herokuapp.com (Heroku)
```
**Environment:** `NEXT_PUBLIC_API_URL=https://your-app.herokuapp.com`

## 🔄 API Endpoints

All existing endpoints work exactly the same:

- `GET /` - Root endpoint
- `GET /health` - Health check
- `POST /query` - AI-powered queries
- `POST /process_csv` - CSV file processing
- `GET /providers` - Provider listing
- `GET /duplicates` - Duplicate clusters
- `GET /analytics/*` - Analytics endpoints

## 🐳 Docker Deployment

### Frontend Only
```bash
# Using docker-compose
docker-compose up

# Using Docker directly
docker build -t hilabs-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-backend-url.com \
  hilabs-frontend
```

### With Backend (if in same repo)
```bash
# From project root
docker-compose up
```

## 🔧 Development

### Adding New API Calls

When adding new API endpoints, use the centralized configuration:

```typescript
// ❌ Don't do this
const response = await fetch('http://localhost:8000/new-endpoint');

// ✅ Do this
const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/new-endpoint`);

// Or use the helper
import { buildApiUrl } from '@/lib/api-config';
const response = await fetch(buildApiUrl('/new-endpoint'));
```

### Environment Setup

1. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Update API URL:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **For production:**
   ```env
   NEXT_PUBLIC_API_URL=https://your-production-backend.com
   ```

## 🚀 Deployment Platforms

### Vercel
1. Connect your repository
2. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.com`
3. Deploy

### Netlify
1. Connect your repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.com`

### Docker/Cloud
1. Build with environment variables
2. Deploy to your preferred platform
3. Ensure CORS is configured on backend

## 🔒 CORS Configuration

Make sure your backend allows requests from your frontend domain:

```python
# Backend CORS settings
cors_origins = [
    "http://localhost:3000",           # Local development
    "https://your-frontend-domain.com", # Production frontend
    "https://app.yourdomain.com",      # Subdomain
]
```

## ✅ What's Changed

### ✅ Repository Ready Features
- ✅ Dynamic API URL configuration
- ✅ Environment-based settings
- ✅ Separate Docker setup
- ✅ Production-ready configuration
- ✅ All API calls updated
- ✅ Backward compatibility maintained

### ✅ Files Modified
- All API calls now use `process.env.NEXT_PUBLIC_API_URL`
- Added `lib/api-config.ts` for centralized configuration
- Created environment files (`.env.local`, `.env.example`, `.env.production`)
- Added separate `docker-compose.yml` for frontend
- Updated `.gitignore` to allow environment files

## 🎯 Next Steps

1. **Copy this folder** to create your frontend repository
2. **Update `.env.local`** with your backend URL
3. **Test locally** with `npm run dev`
4. **Deploy** to your preferred platform
5. **Update backend CORS** to allow your frontend domain

## 📞 Support

The frontend is now completely independent and can be deployed separately from the backend. All functionality remains exactly the same while being fully configurable for different deployment scenarios.
