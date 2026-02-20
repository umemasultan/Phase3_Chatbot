# Task Manager Application

This is a full-stack task management application with AI chatbot capabilities.

## Features

- **Task Management**: Create, read, update, and delete tasks
- **User Authentication**: JWT-based authentication system
- **AI Chatbot**: Conversational AI assistant for task management
- **Real-time Updates**: Live task status updates
- **Responsive UI**: Mobile-friendly interface

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.0+
- **Database**: SQLite (with PostgreSQL support ready)
- **AI Integration**: OpenAI GPT with MCP tools
- **Authentication**: JWT tokens

## Setup

### Backend
1. Navigate to the `backend` directory
2. Install dependencies: `pip install -r requirements.txt`
3. Set up environment variables in `.env` file
4. Start the server: `python start_server.py`

### Frontend
1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the application at `http://localhost:3000` (or the next available port)

## Environment Variables

### Backend (.env)
```
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=sqlite:///./taskmanager.db
SECRET_KEY=your_secret_key
BETTER_AUTH_SECRET=your_auth_secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_DAYS=7
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Endpoints

- `GET /` - Root endpoint
- `GET /docs` - API documentation
- `POST /api/{user_id}/chat` - Chatbot endpoint
- `GET /api/auth/me` - Get current user
- `GET /api/{user_id}/tasks` - Get user tasks
- `POST /api/{user_id}/tasks` - Create new task
- And more...

## AI Chatbot Capabilities

The integrated chatbot can help with:
- Adding new tasks
- Listing existing tasks
- Marking tasks as complete
- Deleting tasks
- Updating task details
- Natural language processing for task management

## Status

The application is fully functional with:
- Working backend API
- Responsive frontend UI
- Integrated AI chatbot
- User authentication system
- Task management features
