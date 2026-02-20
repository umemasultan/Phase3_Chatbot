import sys
import os

# Add the src directory to sys.path to handle imports properly
src_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, src_dir)

# Create a minimal app to test
from fastapi import FastAPI

app = FastAPI(title="Test Server")

@app.get("/")
def read_root():
    return {"message": "Minimal server running"}

if __name__ == "__main__":
    import uvicorn
    print("Starting minimal server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")