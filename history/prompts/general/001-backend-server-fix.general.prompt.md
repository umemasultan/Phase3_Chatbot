---
id: "001"
title: "Backend Server Fix"
stage: "general"
date: "2026-02-15"
surface: "agent"
model: "claude-opus-4-6"
feature: "none"
branch: "master"
user: "user"
command: "Fix backend server startup and API connection issues"
labels:
  - "backend"
  - "server"
  - "api"
  - "connection"
specs:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - "E:/Hackathon_2/Phase_2/backend/src/main.py"
  - "E:/Hackathon_2/Phase_2/backend/src/db/init_db.py"
  - "E:/Hackathon_2/Phase_2/backend/src/auth/jwt_handler.py"
  - "E:/Hackathon_2/Phase_2/frontend/src/lib/api.ts"
tests:
  - "API endpoint accessibility test"
  - "Login endpoint functionality test"
  - "Tasks endpoint accessibility test"
---

# Backend Server Fix

## Summary

Fixed the "net::ERR_CONNECTION_REFUSED" error that was occurring when the frontend tried to connect to the backend API. The issue was caused by incorrect Python import paths preventing the backend server from starting properly.

## Problem

The backend server was failing to start due to Python import errors, specifically:
- `ImportError: attempted relative import with no known parent package`
- `ImportError: attempted relative import beyond top-level package`
- `ModuleNotFoundError: No module named 'database'`

These errors prevented the server from running, resulting in connection refused errors when the frontend tried to access API endpoints.

## Solution

1. **Updated import handling in main.py**: Modified the import logic to properly handle both direct execution and module imports by adding the src directory to sys.path.

2. **Fixed init_db.py imports**: Corrected the import statements in the database initialization file to use proper absolute imports from the src directory.

3. **Maintained CORS configuration**: Kept the CORS configuration to allow connections from `http://localhost:3000`, `http://localhost:3005`, and their 127.0.0.1 variants.

## Verification

- Server successfully starts and runs on http://localhost:8000
- Root endpoint returns `{"message":"Task Manager API"}`
- Login endpoint accessible at `/api/auth/login` (returns "Incorrect email or password" for invalid credentials)
- Tasks endpoint accessible at `/api/{user_id}/tasks` (returns "Not authenticated" without JWT token)
- All API endpoints are accessible, resolving the connection refused error

## Outcome

The backend server now starts successfully, and the frontend can connect to the API at http://localhost:8000 without receiving "net::ERR_CONNECTION_REFUSED" errors.

## Prompt Text

Diagnose and fix login API connection issue.

ERROR:
POST http://localhost:8000/api/auth/login
net::ERR_CONNECTION_REFUSED

OBJECTIVE:
Backend server start karna + frontend ko correct API se connect karna.

## Response Text

Fixed the backend server startup issues by correcting Python import paths in main.py and init_db.py. The server now runs successfully on http://localhost:8000 and API endpoints are accessible, resolving the "net::ERR_CONNECTION_REFUSED" error.

## Evaluation

The fix was successful - the backend server now starts properly and all API endpoints are accessible from the frontend.