---
id: 1
title: "Implement REST API Endpoints"
stage: "red"
date: "2026-02-15"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "rest-api"
branch: "main"
user: "Claude"
command: "implement-get-post-put-delete-endpoints"
labels: ["feature", "api", "rest", "backend", "frontend"]
links:
  spec: "specs/api/rest-endpoints.md"
  ticket: null
  adr: null
  pr: null
files:
  - "backend/src/routers/task_v2.py"
  - "backend/src/main.py"
  - "backend/src/auth/jwt_handler.py"
  - "backend/src/routers/auth.py"
  - "frontend/src/lib/api.ts"
  - "frontend/src/lib/auth.ts"
  - "frontend/src/app/page.tsx"
  - "frontend/src/app/tasks/new/page.tsx"
  - "frontend/src/app/tasks/[id]/page.tsx"
tests:
  - "backend/test/test_rest_endpoints.py"
---

# Implement REST API Endpoints

## Prompt
@specs/api/rest-endpoints.md implement GET/POST/PUT/DELETE endpoints

Implement REST API endpoints according to the specification:
- GET /api/{user_id}/tasks → List tasks
- POST /api/{user_id}/tasks → Create task
- GET /api/{user_id}/tasks/{id} → Task details
- PUT /api/{user_id}/tasks/{id} → Update task
- DELETE /api/{user_id}/tasks/{id} → Delete task
- PATCH /api/{user_id}/tasks/{id}/complete → Toggle completion

With proper authentication using header: Authorization: Bearer <JWT>

## Response
Successfully implemented all required REST API endpoints with user-specific access and JWT authentication:

### Backend Changes:
1. Created new task_v2.py router with spec-compliant endpoints:
   - GET /api/{user_id}/tasks - List tasks with optional status filtering
   - POST /api/{user_id}/tasks - Create new task for specific user
   - GET /api/{user_id}/tasks/{id} - Get specific task details
   - PUT /api/{user_id}/tasks/{id} - Update specific task
   - DELETE /api/{user_id}/tasks/{id} - Delete specific task
   - PATCH /api/{user_id}/tasks/{id}/complete - Toggle task completion status

2. Updated JWT handler to return user object instead of just email
   - Enhanced get_current_user function to return full User object
   - Updated token creation to include user_id in payload

3. Updated auth router to include user ID in JWT token
   - Modified login endpoint to include user_id in access token

4. Updated main application to include new router
   - Maintained backward compatibility with existing router

### Frontend Changes:
1. Enhanced API client with new spec-compliant functions:
   - getAllForUser(), getForUser(), createForUser(), updateForUser(), deleteForUser()
   - toggleComplete() function for completion toggling

2. Updated auth utility to extract user ID from JWT:
   - Added getCurrentUserIdFromToken() function
   - Enhanced getCurrentUserFromToken() to return user_id

3. Updated all relevant pages to use new API endpoints:
   - Dashboard page now uses user-specific endpoints when user ID is available
   - Task creation page uses user-specific endpoint
   - Task detail page uses user-specific endpoints for all operations
   - Added completion toggle button to task detail page

### Security Features:
- User authorization checks to ensure users can only access their own tasks
- Proper JWT validation with Bearer token format
- 7-day token expiry maintained
- Status filtering functionality preserved

## Outcome
All REST API endpoints have been implemented according to the specification:
✓ GET /api/{user_id}/tasks → List tasks with filtering
✓ POST /api/{user_id}/tasks → Create task
✓ GET /api/{user_id}/tasks/{id} → Task details
✓ PUT /api/{user_id}/tasks/{id} → Update task
✓ DELETE /api/{user_id}/tasks/{id} → Delete task
✓ PATCH /api/{user_id}/tasks/{id}/complete → Toggle completion
✓ Authorization: Bearer <JWT> header support

## Evaluation
The implementation follows REST principles and includes proper authentication and authorization. All endpoints validate that users can only access their own tasks, ensuring data security. The frontend properly uses the new endpoints when user ID is available, with fallback to existing endpoints for backward compatibility.