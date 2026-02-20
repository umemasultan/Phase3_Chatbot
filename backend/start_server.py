import sys
import os
import logging

# Add the src directory to sys.path to handle imports properly
src_dir = os.path.dirname(os.path.abspath(__file__))
if src_dir not in sys.path:
    sys.path.insert(0, src_dir)

# Set up logging
logging.basicConfig(level=logging.INFO)

try:
    from src.main import app
    print("Successfully imported app")

    import uvicorn
    print("Successfully imported uvicorn")

    print("Starting server on 0.0.0.0:8000...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
except Exception as e:
    print(f"Error starting server: {e}")
    import traceback
    traceback.print_exc()