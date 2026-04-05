"""
MCP (Model Context Protocol) Server for Todo AI Chatbot
"""
import asyncio
from mcp.server import Server
from mcp.server.stdio import stdio_server
import logging

# Import tools
from tools.add_task import add_task
from tools.list_tasks import list_tasks
from tools.complete_task import complete_task
from tools.delete_task import delete_task
from tools.update_task import update_task

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create the server
server = Server("todo-ai-chatbot-mcp")

# Register all tools
server.add_tool(add_task)
server.add_tool(list_tasks)
server.add_tool(complete_task)
server.add_tool(delete_task)
server.add_tool(update_task)

async def main():
    logger.info("Starting Todo AI Chatbot MCP Server...")
    async with stdio_server() as (read_stream, write_stream):
        await server.run(read_stream, write_stream, [])

if __name__ == "__main__":
    asyncio.run(main())