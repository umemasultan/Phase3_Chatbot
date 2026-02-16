import os
import sys
from pathlib import Path

# Add the src directory to Python path to handle imports
src_path = Path(__file__).parent / "src"
sys.path.insert(0, str(src_path))

if __name__ == "__main__":
    import uvicorn
    # Add src to path
    sys.path.insert(0, str(src_path))
    os.chdir(src_path)

    # Import and run the app
    from main import app
    uvicorn.run(app, host="0.0.0.0", port=8000)