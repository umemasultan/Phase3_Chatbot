# UI Components Specification

## Reusable Components
- TaskCard - Displays task information (title, status, date)
- TaskForm - Handles task creation and editing with validation
- FilterBar - Provides status filtering functionality
- Button - Reusable button with multiple variants and sizes
- Navbar - Navigation header with user authentication controls
- Sidebar - Navigation and filtering sidebar

## Component Props
- TaskCard: { task: Task }
- TaskForm: { title, setTitle, description, setDescription, status, setStatus, onSubmit, error, isEditing?, onCancel? }
- FilterBar: { currentFilter, onFilterChange }
- Button: { variant, size, href, children, ...props }
- Navbar: No props (uses auth context internally)
- Sidebar: No props (uses filter context internally)

## Styling
- All components use Tailwind CSS for styling
- Responsive design implemented
- Consistent color scheme and typography
- Accessible markup and ARIA attributes where appropriate