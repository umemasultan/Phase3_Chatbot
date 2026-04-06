"""
MCP Client for connecting to the official MCP server
"""
import asyncio
import json
from typing import Dict, Any, Optional
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client


class MCPClient:
    """
    Client to connect to the MCP server and call tools
    """
    def __init__(self):
        self.session: Optional[ClientSession] = None
        self.server_params = StdioServerParameters(
            command="python",
            args=["-m", "src.mcp_server"],
            env=None
        )

    async def connect(self):
        """
        Connect to the MCP server
        """
        if self.session is None:
            self.stdio_transport = await stdio_client(self.server_params)
            self.read_stream, self.write_stream = self.stdio_transport
            self.session = ClientSession(self.read_stream, self.write_stream)
            await self.session.initialize()

    async def disconnect(self):
        """
        Disconnect from the MCP server
        """
        if self.session:
            await self.session.__aexit__(None, None, None)
            self.session = None

    async def list_tools(self) -> list:
        """
        Get list of available tools from the MCP server
        """
        await self.connect()
        response = await self.session.list_tools()
        return response.tools

    async def call_tool(self, tool_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Call a tool on the MCP server
        """
        try:
            await self.connect()

            result = await self.session.call_tool(tool_name, arguments)

            # Parse the result
            if result.content and len(result.content) > 0:
                content = result.content[0]
                if hasattr(content, 'text'):
                    # Parse the text response as JSON
                    try:
                        return eval(content.text)  # In production, use json.loads
                    except:
                        return {"success": False, "error": "Failed to parse response"}

            return {"success": False, "error": "No response from tool"}
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "message": f"Failed to call tool {tool_name}: {str(e)}"
            }

    def get_tool_definitions_for_openai(self) -> list:
        """
        Get tool definitions in OpenAI format for function calling
        This is used by the AI agent to know what tools are available
        """
        return [
            {
                "type": "function",
                "function": {
                    "name": "add_task",
                    "description": "Add a new task for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "integer", "description": "User ID"},
                            "title": {"type": "string", "description": "Task title"},
                            "description": {"type": "string", "description": "Task description"}
                        },
                        "required": ["user_id", "title"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "list_tasks",
                    "description": "List all tasks for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "integer", "description": "User ID"},
                            "status": {
                                "type": "string",
                                "description": "Filter by task status (optional)",
                                "enum": ["pending", "in-progress", "completed", "all"]
                            }
                        },
                        "required": ["user_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "complete_task",
                    "description": "Complete a task for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "integer", "description": "User ID"},
                            "task_id": {"type": "integer", "description": "Task ID to complete"}
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "delete_task",
                    "description": "Delete a task for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "integer", "description": "User ID"},
                            "task_id": {"type": "integer", "description": "Task ID to delete"}
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            },
            {
                "type": "function",
                "function": {
                    "name": "update_task",
                    "description": "Update a task for the user",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "user_id": {"type": "integer", "description": "User ID"},
                            "task_id": {"type": "integer", "description": "Task ID to update"},
                            "title": {"type": "string", "description": "New task title (optional)"},
                            "description": {"type": "string", "description": "New task description (optional)"},
                            "status": {
                                "type": "string",
                                "description": "New task status (optional)",
                                "enum": ["pending", "in-progress", "completed"]
                            }
                        },
                        "required": ["user_id", "task_id"]
                    }
                }
            }
        ]


# Global MCP client instance
_mcp_client: Optional[MCPClient] = None


def get_mcp_client() -> MCPClient:
    """
    Get or create the global MCP client instance
    """
    global _mcp_client
    if _mcp_client is None:
        _mcp_client = MCPClient()
    return _mcp_client
