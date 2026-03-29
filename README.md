# 🤖 Phase3_Chatbot - AI-Powered Task Manager

> Production-ready AI Todo chatbot combining OpenAI Agents, MCP server, and intelligent task management for a seamless productivity experience.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green)](https://fastapi.tiangolo.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-yellow)](https://www.python.org/)

## ✨ Features

### 🎯 Core Functionality
- **Smart Task Management** - Create, organize, and track tasks with an intuitive interface
- **AI Chatbot Assistant** - Natural language task management powered by OpenAI GPT
- **Real-time Updates** - Instant synchronization across all your devices
- **Dark Mode Support** - Beautiful UI that adapts to your preference

### 🔐 Security & Authentication
- **JWT-based Authentication** - Secure user sessions with token-based auth
- **Protected Routes** - Role-based access control for sensitive operations
- **Encrypted Storage** - Secure handling of user credentials

### 🎨 Modern UI/UX
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile
- **Gradient Themes** - Eye-catching blue-purple-pink color scheme
- **Smooth Animations** - Polished transitions and micro-interactions
- **Accessibility First** - WCAG compliant interface elements

## 🛠️ Tech Stack

### Frontend
```
Next.js 14        - React framework with App Router
TypeScript        - Type-safe development
Tailwind CSS      - Utility-first styling
React Hooks       - Modern state management
```

### Backend
```
FastAPI           - High-performance Python API
SQLModel          - SQL database ORM
OpenAI API        - GPT-powered AI responses
MCP Tools         - Model Context Protocol integration
```

### Database
```
SQLite            - Development database
PostgreSQL Ready  - Production-ready configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- OpenAI API key

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=sqlite:///./taskmanager.db
SECRET_KEY=your_secret_key_here
BETTER_AUTH_SECRET=your_auth_secret_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=7
EOF

# Start the server
python -m uvicorn src.main:app --reload --port 8000
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

### Access the Application
Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **API Root**: http://localhost:8000

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register    - Create new user account
POST   /api/auth/login       - User login
GET    /api/auth/me          - Get current user info
```

### Task Management
```
GET    /api/{user_id}/tasks           - List all tasks
POST   /api/{user_id}/tasks           - Create new task
GET    /api/{user_id}/tasks/{task_id} - Get task details
PUT    /api/{user_id}/tasks/{task_id} - Update task
DELETE /api/{user_id}/tasks/{task_id} - Delete task
```

### AI Chatbot
```
POST   /api/{user_id}/chat                              - Send message to chatbot
GET    /api/{user_id}/conversations                     - Get conversation history
GET    /api/{user_id}/conversations/{id}/messages       - Get conversation messages
```

## 🤖 AI Chatbot Capabilities

The integrated AI assistant understands natural language and can:

- ✅ **Create Tasks** - "Add a task to buy groceries tomorrow"
- 📋 **List Tasks** - "Show me all my pending tasks"
- ✔️ **Complete Tasks** - "Mark the meeting task as done"
- 🗑️ **Delete Tasks** - "Remove the old project task"
- ✏️ **Update Tasks** - "Change the deadline to next Friday"
- 🔍 **Search Tasks** - "Find tasks related to the project"

## 🎨 UI Components

### Chatbot Interface
- **Floating Action Button** - Quick access from any page
- **Chat Panel** - Elegant conversation interface
- **Message Bubbles** - Distinct user/assistant styling
- **Typing Indicators** - Real-time feedback
- **Error Handling** - Graceful error messages

### Task Management
- **Task Cards** - Visual task representation
- **Filter Bar** - Quick status filtering
- **Search** - Real-time task search
- **Sort Options** - Multiple sorting criteria

## 📁 Project Structure

```
Phase3_Chatbot/
├── backend/
│   ├── src/
│   │   ├── main.py              # FastAPI application
│   │   ├── routers/             # API route handlers
│   │   │   ├── auth.py          # Authentication routes
│   │   │   ├── chat.py          # Chatbot routes
│   │   │   └── task.py          # Task routes
│   │   ├── services/            # Business logic
│   │   │   ├── ai_agent.py      # AI chatbot service
│   │   │   └── mcp_client.py    # MCP integration
│   │   ├── models/              # Database models
│   │   └── db/                  # Database configuration
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js app directory
│   │   │   ├── page.tsx         # Dashboard page
│   │   │   ├── auth/            # Auth pages
│   │   │   └── tasks/           # Task pages
│   │   ├── components/          # React components
│   │   │   ├── chatbot/         # Chatbot components
│   │   │   ├── navbar.tsx       # Navigation bar
│   │   │   └── sidebar.tsx      # Sidebar
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API services
│   │   ├── types/               # TypeScript types
│   │   └── lib/                 # Utility functions
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for chatbot | Yes |
| `DATABASE_URL` | Database connection string | Yes |
| `SECRET_KEY` | JWT secret key | Yes |
| `BETTER_AUTH_SECRET` | Auth encryption key | Yes |
| `ALGORITHM` | JWT algorithm (HS256) | Yes |
| `ACCESS_TOKEN_EXPIRE_DAYS` | Token expiration (days) | Yes |

#### Frontend (.env.local)
| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

## 🚢 Deployment

### Backend Deployment
```bash
# Using Uvicorn
uvicorn src.main:app --host 0.0.0.0 --port 8000

# Using Docker
docker build -t taskmanager-backend .
docker run -p 8000:8000 taskmanager-backend
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel
vercel deploy
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📝 License

This project is licensed under the MIT License.

## 👥 Author

**Umema Sultan**

## 🙏 Acknowledgments

- OpenAI for GPT API
- FastAPI team for the amazing framework
- Next.js team for the React framework
- Tailwind CSS for the styling system

---

<div align="center">
  <strong>Built with ❤️ using Next.js, FastAPI, and OpenAI</strong>
</div>
