# Quickstart: Todo AI Chatbot

## Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL (or Neon PostgreSQL account)
- OpenAI API key
- Better Auth configured

## Setup Steps

### 1. Environment Setup
```bash
# Clone the repository
git clone <repository-url>
cd <repository-name>

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Install frontend dependencies
cd frontend
npm install
```

### 2. Environment Variables
Create `.env` file in backend root:
```env
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://user:password@localhost:5432/todo_chatbot
NEON_PROJECT_ID=your_neon_project_id
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Database Setup
```bash
# Run database migrations
python -m src.database.migrate

# Or if using SQLModel directly:
python -c "from src.models import create_tables; create_tables()"
```

### 4. Running the Application
```bash
# Terminal 1: Start MCP server
cd mcp
python server.py

# Terminal 2: Start backend API
cd backend
python -m src.main

# Terminal 3: Start frontend
cd frontend
npm run dev
```

## API Endpoints

### Chat API
```
POST /api/{user_id}/chat
{
  "message": "Add task: Buy milk"
}
```

Response:
```json
{
  "response": "I've added the task 'Buy milk' for you.",
  "conversation_id": "uuid",
  "message_id": "uuid"
}
```

## Testing the Chatbot
1. Navigate to the dashboard in your browser
2. The floating chatbot panel should appear in the bottom-right corner
3. Click to expand and start a conversation
4. Try commands like:
   - "Add task: Buy milk"
   - "Show pending tasks"
   - "Complete task 1"
   - "Delete task 2"

## Development Workflow
1. Make changes to backend in `/backend/src/`
2. Make changes to frontend in `/frontend/src/`
3. MCP tools are in `/mcp/tools/`
4. Run tests with `pytest` in backend and `npm test` in frontend