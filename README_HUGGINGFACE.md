---
title: Task Manager Backend API
emoji: 📋
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
---

# Task Manager Backend API

FastAPI backend for Task Manager application with AI-powered chatbot.

## Features
- 🔐 User Authentication (JWT)
- ✅ Task Management (CRUD operations)
- 🤖 AI Chatbot Assistant
- 💬 Conversation History
- 📊 Task Statistics

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get task by ID
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Chat
- `POST /api/{user_id}/chat` - Chat with AI assistant
- `GET /api/{user_id}/conversations` - Get conversation history
- `GET /api/{user_id}/conversations/{conversation_id}/messages` - Get messages

## API Documentation
Once deployed, visit `/docs` for interactive API documentation.

## Technology Stack
- FastAPI
- SQLModel (SQLAlchemy + Pydantic)
- SQLite Database
- JWT Authentication
- OpenAI API (optional)

## Environment Variables
Set these in Space Settings:
- `JWT_SECRET_KEY` - Secret key for JWT tokens
- `OPENAI_API_KEY` - OpenAI API key (optional, for AI features)

## Author
**Umema Sultan**

## License
Apache 2.0
