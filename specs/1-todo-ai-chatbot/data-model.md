# Data Model: Todo AI Chatbot

## Entity: Task
**Representation**: A user's todo item
**Fields**:
- id (UUID/Integer): Primary key, unique identifier
- user_id (UUID/String): Foreign key to user, identifies owner
- title (String): Task title/description
- description (String, optional): Detailed task description
- completed (Boolean): Completion status (default: false)
- created_at (DateTime): Timestamp of creation
- updated_at (DateTime): Timestamp of last update

**Validation rules**:
- title is required and must be between 1-255 characters
- user_id must reference an existing user
- completed defaults to false

**Relationships**:
- Belongs to User (many-to-one)
- Belongs to Conversation via user_id (indirect relationship)

## Entity: Conversation
**Representation**: A single conversation thread between user and AI
**Fields**:
- id (UUID/Integer): Primary key, unique identifier
- user_id (UUID/String): Foreign key to user, identifies owner
- created_at (DateTime): Timestamp of creation
- updated_at (DateTime): Timestamp of last interaction

**Validation rules**:
- user_id must reference an existing user
- created_at and updated_at are auto-populated

**Relationships**:
- Belongs to User (many-to-one)
- Has many Messages (one-to-many)

## Entity: Message
**Representation**: A single message within a conversation
**Fields**:
- id (UUID/Integer): Primary key, unique identifier
- user_id (UUID/String): Foreign key to user, identifies sender
- conversation_id (UUID/Integer): Foreign key to conversation
- role (String): Message role ('user' or 'assistant')
- content (Text): Message content
- created_at (DateTime): Timestamp of creation

**Validation rules**:
- role must be either 'user' or 'assistant'
- content is required and must be between 1-10000 characters
- conversation_id must reference an existing conversation
- user_id must reference an existing user

**Relationships**:
- Belongs to User (many-to-one)
- Belongs to Conversation (many-to-one)

## Entity: User (Existing)
**Representation**: System user with authentication
**Fields**:
- id (UUID/String): Primary key, unique identifier
- email (String): User's email address
- name (String, optional): User's display name
- created_at (DateTime): Account creation timestamp
- updated_at (DateTime): Last update timestamp

**Relationships**:
- Has many Tasks (one-to-many)
- Has many Conversations (one-to-many)
- Has many Messages (one-to-many)

## State Transitions

### Task State Transitions
- Created (completed: false) → Updated (title/description changed)
- Incomplete (completed: false) → Complete (completed: true)
- Complete (completed: true) → Incomplete (completed: false)

### Conversation State Transitions
- Created (new conversation) → Active (ongoing conversation)
- Active → Inactive (no new messages for extended period)

### Message State Transitions
- Created → Stored (message persisted in database)