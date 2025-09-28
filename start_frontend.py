#!/usr/bin/env python3
"""
Startup script for PocketPM frontend server.
This script handles dependency installation and starts the React development server.
"""

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, cwd=None):
    """Run a command and return the result."""
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            cwd=cwd, 
            capture_output=True, 
            text=True
        )
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def main():
    # Get the directory where this script is located
    script_dir = Path(__file__).parent.absolute()
    frontend_dir = script_dir / "frontend"
    
    if not frontend_dir.exists():
        print(f"Error: Frontend directory not found at {frontend_dir}")
        return 1
    
    print(f"Starting PocketPM frontend from: {frontend_dir}")
    
    # Check if node_modules exists
    node_modules = frontend_dir / "node_modules"
    if not node_modules.exists():
        print("Installing dependencies...")
        success, stdout, stderr = run_command("npm install --force", cwd=frontend_dir)
        if not success:
            print(f"Failed to install dependencies: {stderr}")
            return 1
        print("Dependencies installed successfully!")
    
    print("Starting React development server...")
    print("Frontend will be available at: http://localhost:3000")
    print("\nPress Ctrl+C to stop the server\n")
    
    try:
        # Start the React development server
        subprocess.run(["npm", "start"], cwd=frontend_dir)
    except KeyboardInterrupt:
        print("\nShutting down PocketPM frontend server...")
    except Exception as e:
        print(f"Error starting frontend server: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
