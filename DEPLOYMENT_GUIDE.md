# 🚀 Deployment Guide - Task Manager

## Pre-Deployment Changes Required

### 1. Update Frontend Package.json
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.1",
    "react-hook-form": "^7.49.3",
    "swr": "^2.2.4",
    "socket.io-client": "^4.6.1",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    "date-fns": "^3.0.6",
    "react-hot-toast": "^2.4.1"
  }
}
```

### 2. Setup MongoDB Atlas
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster (free tier)
4. Create database user with password
5. Whitelist all IPs: 0.0.0.0/0
6. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/task-manager`

### 3. Generate JWT Secret
```bash
# Use this command to generate secure secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Backend Deployment (Render)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Deploy Backend
1. Click "New +" → "Web Service"
2. Connect GitHub repository
3. Configure:
   - **Name**: task-manager-backend
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

### Step 3: Set Environment Variables
Add these in Render dashboard:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/task-manager
JWT_SECRET=your-generated-64-char-secret
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Step 4: Deploy
- Click "Create Web Service"
- Wait for deployment (5-10 minutes)
- Note your backend URL: `https://your-app.onrender.com`

## Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub

### Step 2: Deploy Frontend
1. Click "New Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist

### Step 3: Set Environment Variables
Add these in Vercel dashboard:
```
VITE_API_URL=https://your-backend.onrender.com/api/v1
VITE_SOCKET_URL=https://your-backend.onrender.com
```

### Step 4: Deploy
- Click "Deploy"
- Wait for deployment (2-3 minutes)
- Note your frontend URL: `https://your-app.vercel.app`

## Update Backend Environment

After frontend deployment, update backend environment variable:
```
FRONTEND_URL=https://your-app.vercel.app
```

## Final Testing Checklist

### ✅ Test These Features:
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Create task works
- [ ] Update task works
- [ ] Delete task works
- [ ] Real-time updates work (open 2 browsers)
- [ ] Task assignment notifications work
- [ ] All toast notifications appear
- [ ] Mobile responsive design works

### ✅ Check URLs:
- [ ] Backend health check: `https://your-backend.onrender.com/health`
- [ ] Frontend loads: `https://your-app.vercel.app`
- [ ] No CORS errors in browser console
- [ ] Socket.io connects successfully

## Common Issues & Solutions

### CORS Error
- Check `FRONTEND_URL` in backend environment
- Must match exactly with deployed frontend URL
- Include `https://` protocol

### Socket.io Connection Failed
- Check `VITE_SOCKET_URL` in frontend environment
- Should be backend URL without `/api/v1`
- Render supports WebSockets by default

### MongoDB Connection Error
- Check MongoDB Atlas connection string
- Verify username/password are correct
- Ensure IP whitelist includes 0.0.0.0/0

### Build Failures
- Check all dependencies are in package.json
- Verify Node.js version compatibility
- Check for TypeScript errors

## Environment Variables Summary

### Backend (.env for local, Render dashboard for production):
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/task-manager
JWT_SECRET=your-64-char-secret
JWT_EXPIRE=7d
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (.env for local, Vercel dashboard for production):
```
VITE_API_URL=https://your-backend.onrender.com/api/v1
VITE_SOCKET_URL=https://your-backend.onrender.com
```

## Submission Requirements

### Required for Google Form:
1. **GitHub Repository URL**: Make it public
2. **Live Frontend URL**: https://your-app.vercel.app
3. **Live Backend URL**: https://your-backend.onrender.com

### Keep These Running:
- Deployments must stay live for 4-8 weeks
- Free tiers of Render and Vercel are sufficient
- Monitor for any downtime

## Quick Commands

### Local Development:
```bash
# Backend
cd backend && npm run dev

# Frontend (new terminal)
cd frontend && npm run dev
```

### Production Build Test:
```bash
# Backend
cd backend && npm run build && npm start

# Frontend
cd frontend && npm run build && npm run preview
```

---

**🎯 That's it! Your app should now be live and ready for submission.**

**Important**: Test everything thoroughly before submitting. The evaluation process takes 4-8 weeks, so ensure your deployments remain active.