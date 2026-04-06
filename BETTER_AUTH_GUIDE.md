






# Better Auth Integration Guide

## Overview
This guide explains how to integrate Better Auth for authentication in the Todo AI Chatbot.

## Current Status
⚠️ **Currently using custom JWT authentication**

The project currently uses a custom JWT implementation. To achieve full Phase III compliance, Better Auth needs to be integrated.

## Prerequisites
1. Better Auth package installed: `pip install better-auth`
2. Database configured (SQLite or Neon PostgreSQL)
3. Frontend authentication flow

## Step 1: Install Better Auth

```bash
cd backend
pip install better-auth
```

Add to `requirements.txt`:
```
better-auth>=0.0.1b11
```

## Step 2: Configure Better Auth

Create `backend/src/auth/better_auth_config.py`:

```python
from better_auth import BetterAuth
from better_auth.providers import EmailPassword
import os

# Initialize Better Auth
auth = BetterAuth(
    secret=os.getenv("AUTH_SECRET", "your-secret-key-here"),
    database_url=os.getenv("DATABASE_URL"),
    providers=[
        EmailPassword()
    ],
    session={
        "expires_in": 60 * 60 * 24 * 7,  # 7 days
        "update_age": 60 * 60 * 24  # 1 day
    }
)
```

## Step 3: Create Auth Router

Create `backend/src/routers/better_auth.py`:

```python
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from auth.better_auth_config import auth

router = APIRouter(prefix="/api/auth", tags=["authentication"])


class SignUpRequest(BaseModel):
    email: str
    password: str
    name: str


class SignInRequest(BaseModel):
    email: str
    password: str


@router.post("/signup")
async def signup(request: SignUpRequest):
    """Register a new user"""
    try:
        result = await auth.sign_up(
            email=request.email,
            password=request.password,
            name=request.name
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/signin")
async def signin(request: SignInRequest):
    """Sign in an existing user"""
    try:
        result = await auth.sign_in(
            email=request.email,
            password=request.password
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")


@router.post("/signout")
async def signout(session_token: str):
    """Sign out the current user"""
    try:
        await auth.sign_out(session_token)
        return {"message": "Signed out successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/session")
async def get_session(session_token: str):
    """Get current session information"""
    try:
        session = await auth.get_session(session_token)
        return session
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid session")
```

## Step 4: Update Main App

Update `backend/src/main.py`:

```python
from routers import task, task_v2, auth, chat, better_auth

app = FastAPI(
    title="Task Manager API",
    description="FastAPI backend for Task Manager with AI chatbot",
    version="1.0.0"
)

# Include routers
app.include_router(task.router)
app.include_router(task_v2.router)
app.include_router(auth.router)  # Keep for backward compatibility
app.include_router(better_auth.router)  # New Better Auth router
app.include_router(chat.router)
```

## Step 5: Protect Routes with Better Auth

Create middleware `backend/src/auth/better_auth_middleware.py`:

```python
from fastapi import Request, HTTPException
from auth.better_auth_config import auth


async def verify_session(request: Request):
    """Middleware to verify Better Auth session"""
    session_token = request.cookies.get("session_token")
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        session = await auth.get_session(session_token)
        request.state.user = session.user
        return session.user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid session")
```

Use in protected routes:

```python
from auth.better_auth_middleware import verify_session

@router.post("/{user_id}/chat")
async def chat(
    user_id: int,
    request: ChatRequest,
    current_user = Depends(verify_session)
):
    # Verify user_id matches authenticated user
    if current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    # Process chat request...
```

## Step 6: Frontend Integration

Install Better Auth client:

```bash
cd frontend
npm install better-auth
```

Create `frontend/src/lib/auth.ts`:

```typescript
import { createAuthClient } from 'better-auth/client';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export const signUp = async (email: string, password: string, name: string) => {
  return await authClient.signUp.email({
    email,
    password,
    name,
  });
};

export const signIn = async (email: string, password: string) => {
  return await authClient.signIn.email({
    email,
    password,
  });
};

export const signOut = async () => {
  return await authClient.signOut();
};

export const getSession = async () => {
  return await authClient.getSession();
};
```

## Step 7: Create Auth Components

Create `frontend/src/components/AuthForm.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { signIn, signUp } from '@/lib/auth';

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isSignUp) {
        await signUp(email, password, name);
      } else {
        await signIn(email, password);
      }
      // Redirect to chat interface
      window.location.href = '/chat';
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignUp && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">
        {isSignUp ? 'Sign Up' : 'Sign In'}
      </button>
      <button type="button" onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account?' : 'Need an account?'}
      </button>
    </form>
  );
}
```

## Step 8: Environment Variables

Add to `backend/.env`:

```env
AUTH_SECRET=your-super-secret-key-here-min-32-chars
DATABASE_URL=sqlite:///./data/taskmanager.db
```

Add to `frontend/.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

## Migration from Custom JWT

To migrate from the current JWT implementation:

1. Keep existing JWT routes for backward compatibility
2. Add Better Auth routes alongside
3. Gradually migrate users to Better Auth
4. Update frontend to use Better Auth client
5. Remove JWT implementation once migration is complete

## Benefits of Better Auth

1. **Built-in Security**: Industry-standard security practices
2. **Multiple Providers**: Email, OAuth, Magic Links
3. **Session Management**: Automatic session handling
4. **Type Safety**: Full TypeScript support
5. **Easy Integration**: Works with FastAPI and Next.js

## Testing

Test authentication flow:

```bash
# Sign up
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Sign in
curl -X POST http://localhost:8000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get session
curl -X GET http://localhost:8000/api/auth/session \
  -H "Cookie: session_token=YOUR_SESSION_TOKEN"
```

## References

- Better Auth Docs: https://www.better-auth.com/
- Better Auth GitHub: https://github.com/better-auth/better-auth
- FastAPI Integration: https://www.better-auth.com/docs/integrations/fastapi

---

**Author:** Umema Sultan  
**Date:** 2026-04-06  
**Status:** Guide created, implementation pending
