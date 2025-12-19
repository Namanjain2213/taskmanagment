# 🚀 Task Manager - Full-Stack Application

A production-ready, real-time task management application with modern tech stack.

## ✨ Features

- 🔐 Secure user authentication with JWT
- 📝 Full CRUD operations for tasks
- ⚡ Real-time collaboration with Socket.io
- 📱 Responsive mobile-first design
- 🔔 Toast notifications for all actions
- 📊 Dashboard with personal task views
- 🔍 Advanced filtering and sorting
- 📬 In-app notification system

## 🛠️ Tech Stack

**Frontend:** React 18 + TypeScript + Tailwind CSS + SWR + Socket.io  
**Backend:** Node.js + Express + TypeScript + MongoDB + Socket.io  
**Deployment:** Vercel (Frontend) + Render (Backend) + MongoDB Atlas

## 🚀 Quick Start

### Local Development

1. **Clone and install:**
```bash
git clone <your-repo>
cd task-manager

# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB URI

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env
```

2. **Start servers:**
```bash
# Backend
cd backend && npm run dev

# Frontend (new terminal)
cd frontend && npm run dev
```

3. **Open:** http://localhost:5173

### Docker (Alternative)
```bash
docker-compose up
```

## 🌐 Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for complete deployment instructions.

## 📡 API Endpoints

- **Auth:** `/api/v1/auth/register`, `/api/v1/auth/login`, `/api/v1/auth/logout`
- **Tasks:** `/api/v1/tasks` (GET, POST, PUT, DELETE)
- **Users:** `/api/v1/users` (for task assignment)
- **Notifications:** `/api/v1/notifications`

## 🏗️ Architecture

```
backend/src/
├── controllers/    # HTTP request handlers
├── services/       # Business logic
├── repositories/   # Database operations
├── models/         # MongoDB schemas
├── routes/         # API endpoints
└── socket/         # Real-time events

frontend/src/
├── components/     # UI components
├── pages/          # Route pages
├── hooks/          # Custom React hooks
└── services/       # API & Socket clients
```

## 🔔 Toast Notifications

The app includes comprehensive toast notifications for:
- ✅ Success actions (login, task created, etc.)
- ❌ Error handling (network errors, validation)
- 📬 Real-time notifications (task assignments)

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Works seamlessly on desktop, tablet, and mobile
- Touch-friendly interface elements

## 🔒 Security

- JWT tokens in HttpOnly cookies
- Password hashing with bcrypt
- Input validation with Zod
- CORS protection
- MongoDB injection prevention

## 📄 License

MIT
