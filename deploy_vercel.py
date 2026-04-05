"""
Vercel Deployment Script for Frontend
Author: Umema Sultan
"""
import subprocess
import sys
import os

print("Starting Vercel Deployment...")
print("=" * 60)

# Check if vercel CLI is installed
try:
    result = subprocess.run(['vercel', '--version'], capture_output=True, text=True)
    print(f"Vercel CLI version: {result.stdout.strip()}")
except FileNotFoundError:
    print("Vercel CLI not found. Installing...")
    subprocess.run([sys.executable, '-m', 'pip', 'install', 'vercel'])

# Change to frontend directory
os.chdir('frontend')

print("\nDeploying to Vercel...")
print("This will open a browser for authentication if needed.")

# Deploy to Vercel
try:
    # Production deployment
    result = subprocess.run(
        ['vercel', '--prod', '--yes'],
        capture_output=True,
        text=True
    )

    if result.returncode == 0:
        print("\nDeployment Successful!")
        print(result.stdout)
    else:
        print("\nDeployment failed:")
        print(result.stderr)

except Exception as e:
    print(f"Error during deployment: {e}")
    print("\nManual deployment steps:")
    print("1. Install Vercel CLI: npm install -g vercel")
    print("2. Run: cd frontend && vercel --prod")

print("\n" + "=" * 60)
