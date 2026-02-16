import os
import sys
from pathlib import Path

# Add the src directory to the Python path
src_path = Path(__file__).parent / "src"
sys.path.insert(0, str(src_path))

# Set the working directory to the src folder
os.chdir(src_path)

# Need to run as a module to resolve relative imports
if __name__ == "__main__":
    import subprocess
    import sys
    os.environ['PYTHONPATH'] = str(src_path)
    result = subprocess.run([sys.executable, "-m", "src.main"],
                            env=os.environ)