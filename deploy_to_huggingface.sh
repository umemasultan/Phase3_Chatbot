#!/bin/bash

# Hugging Face Deployment Script
# Author: Umema Sultan

echo "🚀 Deploying Task Manager Backend to Hugging Face Spaces"
echo "=========================================================="

# Check if huggingface-cli is installed
if ! command -v huggingface-cli &> /dev/null
then
    echo "❌ huggingface-cli not found. Installing..."
    pip install huggingface_hub
fi

# Login to Hugging Face (if not already logged in)
echo ""
echo "📝 Please login to Hugging Face (if not already logged in)"
huggingface-cli whoami || huggingface-cli login

# Get username
read -p "Enter your Hugging Face username: " HF_USERNAME

# Space name
SPACE_NAME="task-manager-backend"
SPACE_URL="https://huggingface.co/spaces/$HF_USERNAME/$SPACE_NAME"

echo ""
echo "Creating Space: $SPACE_NAME"

# Create the Space
huggingface-cli repo create $SPACE_NAME --type space --space_sdk docker --exist-ok

# Clone the Space repository
echo ""
echo "📦 Cloning Space repository..."
rm -rf temp_hf_space
git clone https://huggingface.co/spaces/$HF_USERNAME/$SPACE_NAME temp_hf_space

# Copy files to the Space
echo ""
echo "📋 Copying files..."
cd temp_hf_space

# Copy backend folder
cp -r ../backend .

# Copy deployment files
cp ../Dockerfile .
cp ../requirements.txt .
cp ../README_HUGGINGFACE.md README.md

# Create .gitignore
cat > .gitignore << EOF
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
*.db
*.log
.env
.DS_Store
EOF

# Commit and push
echo ""
echo "🔄 Committing and pushing to Hugging Face..."
git add .
git commit -m "Deploy Task Manager Backend API by Umema Sultan"
git push

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your Space URL: $SPACE_URL"
echo "📚 API Docs: $SPACE_URL/docs"
echo ""
echo "⚙️  Next steps:"
echo "1. Go to $SPACE_URL/settings"
echo "2. Add environment variables:"
echo "   - JWT_SECRET_KEY: your-secret-key-here"
echo "   - OPENAI_API_KEY: your-openai-key (optional)"
echo "3. Wait for the Space to build (2-5 minutes)"
echo "4. Test your API at $SPACE_URL/docs"
echo ""
echo "🎉 Happy deploying!"

# Cleanup
cd ..
rm -rf temp_hf_space
