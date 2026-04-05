# REST API Endpoints

## Authentication
Header: Authorization: Bearer <JWT>

## Endpoints
- GET /api/{user_id}/tasks → List tasks
- POST /api/{user_id}/tasks → Create task
- GET /api/{user_id}/tasks/{id} → Task details
- PUT /api/{user_id}/tasks/{id} → Update task
- DELETE /api/{user_id}/tasks/{id} → Delete task
- PATCH /api/{user_id}/tasks/{id}/complete → Toggle completion