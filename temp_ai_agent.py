    def _get_simple_response(self, message: str) -> str:
        """
        Provide a simple response when OpenAI API is not configured
        """
        message_lower = message.lower()
        if any(keyword in message_lower for keyword in ['add', 'create', 'new', 'remember', 'buy groceries']):
            return "Sure! You can add tasks using the task manager interface. For example, you could add 'Buy groceries' as a new task. I'm here to assist when my AI powers are enabled with an API key!"
        elif any(keyword in message_lower for keyword in ['show', 'list', 'display', 'my', 'tasks', 'what']):
            return "You can view all your tasks in the task manager dashboard. This shows pending, in-progress, and completed tasks. When I have my AI powers enabled, I can help manage them more intelligently!"
        elif any(keyword in message_lower for keyword in ['complete', 'done', 'finish', 'completed']):
            return "Great! You can mark tasks as complete in the task manager. I'll be able to help you manage task completion automatically when my AI is enabled!"
        elif any(keyword in message_lower for keyword in ['delete', 'remove', 'cancel']):
            return "You can remove tasks from your list in the task manager. With my AI enabled, I could help you manage these operations seamlessly!"
        elif any(keyword in message_lower for keyword in ['update', 'change', 'modify', 'rename', 'hello', 'hi', 'help']):
            return "Hello there! I'm your helpful task management assistant. While I'm currently running in demo mode (without an API key), I can help you manage tasks through the UI. Enable my AI powers by configuring an API key in the backend settings for full voice and command capabilities!"
        else:
            return "Hello! I'm here to help manage your tasks! You can add, track, and complete tasks through the interface. When my AI features are enabled with an API key, I can respond to commands like 'add task', 'show tasks', 'complete task', etc. How can I assist you today?"