# Database Schema

## users (managed by Better Auth)
- id: string PK
- email: string unique
- name: string
- created_at: timestamp

## tasks
- id: int PK
- user_id: string FK -> users.id
- title: string
- description: text
- completed: boolean (default false)
- created_at: timestamp
- updated_at: timestamp