# UI Pages Specification

## Pages
- Dashboard (/) - Shows user's tasks with filtering options
- Task Creation (/tasks/new) - Form to create new tasks
- Task Detail (/tasks/[id]) - View and edit individual tasks
- Login (/auth/login) - User authentication
- Signup (/auth/signup) - User registration

## Components Used
- Navbar - Navigation header with user info
- Sidebar - Filter and stats sidebar
- TaskCard - Display individual tasks
- TaskForm - Reusable form for task creation/editing
- FilterBar - Task filtering controls
- Button - Reusable button component

## API Integration
- All pages use the API client for data fetching and mutations
- Proper authentication handling with JWT tokens
- Error handling and loading states
- Responsive design for all screen sizes