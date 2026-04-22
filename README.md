# Realtime Collaborative Code Editor 🖊️

A production-ready real-time collaborative code editor — like Google Docs but for developers!

## Live Demo 🚀
Pull and run Docker image:
```bash
docker pull kashis01/realtime-editor:latest
docker run -p 3000:3000 kashis01/realtime-editor:latest
```
Then open: `http://localhost:3000`

## Features ✨
- 👥 Real-time collaboration — multiple users edit simultaneously
- 🖱️ Cursor tracking — see each user's cursor in different colors
- 💬 Real-time chat system
- 🔑 JWT Authentication (Register/Login)
- 💾 Auto-save every 30 seconds to MongoDB
- 🐳 Dockerized with multi-stage build

## Tech Stack 🛠️
- **Frontend:** React.js, Tailwind CSS, Monaco Editor
- **Real-time:** Yjs (CRDT), Socket.io
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcryptjs
- **Container:** Docker (multi-stage build)

## Getting Started 🚀

### Without Docker
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### With Docker
```bash
docker pull kashis01/realtime-editor:latest
docker run -p 3000:3000 kashis01/realtime-editor:latest
```

## Architecture 🏗️
Frontend (React) ──── Socket.io ──── Backend (Node.js)
│                                      │
Monaco Editor                        MongoDB
│                                      │
Yjs CRDT ←──── Real-time Sync ────► Yjs Server

## API Endpoints 📡
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| POST | /api/docs/save | Save document |
| GET | /api/docs/get | Get document |

## Docker Image 🐳
```bash
docker pull kashis01/realtime-editor:latest
```
DockerHub: `kashis01/realtime-editor`
