# OpenAI ChatKit Frontend Setup Guide

## Overview
This guide explains how to integrate OpenAI ChatKit as the frontend for the Todo AI Chatbot.

## Prerequisites
1. OpenAI API account
2. Domain for deployment (Vercel, GitHub Pages, or custom)
3. OpenAI domain key (obtained after domain allowlist configuration)

## Step 1: Domain Allowlist Configuration

Before deploying ChatKit, you MUST configure OpenAI's domain allowlist:

1. **Deploy your frontend first** to get a production URL:
   - Vercel: `https://your-app.vercel.app`
   - GitHub Pages: `https://username.github.io/repo-name`
   - Custom domain: `https://yourdomain.com`

2. **Add domain to OpenAI allowlist**:
   - Navigate to: https://platform.openai.com/settings/organization/security/domain-allowlist
   - Click "Add domain"
   - Enter your frontend URL (without trailing slash)
   - Save changes

3. **Get your ChatKit domain key**:
   - After adding the domain, OpenAI will provide a domain key
   - Save this key for the next step

## Step 2: Install OpenAI ChatKit

```bash
cd frontend
npm install @openai/chatkit
```

## Step 3: Configure Environment Variables

Create/update `frontend/.env.local`:

```env
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your-domain-key-here
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com
```

## Step 4: Create ChatKit Component

Create `frontend/src/components/ChatKitInterface.tsx`:

```typescript
'use client';

import { ChatKit } from '@openai/chatkit';
import '@openai/chatkit/styles.css';

export default function ChatKitInterface({ userId }: { userId: number }) {
  return (
    <div className="h-screen w-full">
      <ChatKit
        domainKey={process.env.NEXT_PUBLIC_OPENAI_DOMAIN_KEY!}
        apiEndpoint={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/${userId}/chat`}
        placeholder="Ask me to manage your tasks..."
        welcomeMessage="Hello! I'm your AI task assistant. I can help you add, list, complete, delete, and update tasks. How can I help you today?"
      />
    </div>
  );
}
```

## Step 5: Update Main Page

Update `frontend/src/app/page.tsx`:

```typescript
import ChatKitInterface from '@/components/ChatKitInterface';

export default function Home() {
  // In production, get userId from authentication
  const userId = 1; // Replace with actual user ID from auth

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <ChatKitInterface userId={userId} />
    </main>
  );
}
```

## Step 6: Backend API Compatibility

Ensure your backend `/api/{user_id}/chat` endpoint returns the correct format:

```json
{
  "response": "AI assistant's response text",
  "conversation_id": "123",
  "message_id": "456"
}
```

ChatKit expects:
- `response` field with the AI's text response
- Optional `conversation_id` for maintaining context
- Optional `message_id` for message tracking

## Step 7: Deploy and Test

1. **Deploy frontend**:
   ```bash
   cd frontend
   vercel deploy --prod
   ```

2. **Verify domain allowlist**:
   - Ensure your production URL is in OpenAI's domain allowlist
   - Verify the domain key is correct in environment variables

3. **Test the chatbot**:
   - Open your deployed frontend
   - Try commands like:
     - "Add a task to buy groceries"
     - "Show me all my tasks"
     - "Mark task 1 as complete"
     - "Delete task 2"

## Troubleshooting

### ChatKit not loading
- Verify domain is in OpenAI allowlist
- Check domain key is correct
- Ensure backend API is accessible

### API errors
- Check backend URL in environment variables
- Verify CORS is enabled on backend
- Check network tab for API response format

### Authentication issues
- Implement proper user authentication
- Pass correct userId to ChatKit component
- Verify JWT tokens if using authentication

## Current Status

⚠️ **NOT YET IMPLEMENTED**

The current frontend uses a custom Next.js implementation instead of OpenAI ChatKit.

To achieve full Phase III compliance, you need to:
1. Install `@openai/chatkit` package
2. Configure domain allowlist on OpenAI platform
3. Replace custom chat UI with ChatKit component
4. Deploy and test with production domain

## References

- OpenAI ChatKit Docs: https://platform.openai.com/docs/chatkit
- Domain Allowlist: https://platform.openai.com/settings/organization/security/domain-allowlist
- OpenAI API: https://platform.openai.com/docs

---

**Author:** Umema Sultan  
**Date:** 2026-04-06
