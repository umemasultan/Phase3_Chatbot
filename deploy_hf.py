"""
Hugging Face Deployment Script
Author: Umema Sultan
"""
from huggingface_hub import HfApi, create_repo
import os
import sys

# Fix encoding for Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# Configuration
HF_TOKEN = os.getenv("HF_TOKEN", "your-huggingface-token-here")
SPACE_NAME = "task-manager-backend"
REPO_TYPE = "space"
SPACE_SDK = "docker"

print("Starting Hugging Face Deployment...")
print("=" * 60)

# Initialize API
api = HfApi(token=HF_TOKEN)

# Get username
try:
    user_info = api.whoami(token=HF_TOKEN)
    username = user_info['name']
    print(f"Logged in as: {username}")
except Exception as e:
    print(f"Error getting user info: {e}")
    exit(1)

# Create Space
repo_id = f"{username}/{SPACE_NAME}"
print(f"\nCreating Space: {repo_id}")

try:
    create_repo(
        repo_id=repo_id,
        token=HF_TOKEN,
        repo_type=REPO_TYPE,
        space_sdk=SPACE_SDK,
        exist_ok=True
    )
    print(f"Space created/verified: {repo_id}")
except Exception as e:
    print(f"Error creating space: {e}")
    exit(1)

# Upload files
print("\nUploading files...")

files_to_upload = [
    ("Dockerfile", "Dockerfile"),
    ("requirements.txt", "requirements.txt"),
    ("README_HUGGINGFACE.md", "README.md"),
]

for local_path, remote_path in files_to_upload:
    try:
        api.upload_file(
            path_or_fileobj=local_path,
            path_in_repo=remote_path,
            repo_id=repo_id,
            repo_type=REPO_TYPE,
            token=HF_TOKEN
        )
        print(f"  Uploaded: {remote_path}")
    except Exception as e:
        print(f"  Error uploading {remote_path}: {e}")

# Upload backend folder
print("\nUploading backend folder...")
try:
    api.upload_folder(
        folder_path="backend",
        path_in_repo="backend",
        repo_id=repo_id,
        repo_type=REPO_TYPE,
        token=HF_TOKEN,
        ignore_patterns=["*.pyc", "__pycache__", "*.db", "*.log"]
    )
    print("  Backend folder uploaded")
except Exception as e:
    print(f"  Error uploading backend: {e}")

print("\n" + "=" * 60)
print("Deployment Complete!")
print(f"\nYour Space URL: https://huggingface.co/spaces/{repo_id}")
print(f"API Docs: https://{username}-{SPACE_NAME}.hf.space/docs")
print("\nNext steps:")
print(f"1. Go to https://huggingface.co/spaces/{repo_id}/settings")
print("2. Add environment variables:")
print("   - JWT_SECRET_KEY: your-secret-key")
print("   - OPENAI_API_KEY: your-openai-key (optional)")
print("3. Wait 2-5 minutes for build to complete")
print("\nHappy deploying!")
