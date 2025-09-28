#!/usr/bin/env python3
"""
Startup script for PocketPM backend server.
This script ensures the backend starts from the correct directory with proper module paths.
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    # Get the directory where this script is located
    script_dir = Path(__file__).parent.absolute()
    backend_dir = script_dir / "backend"
    
    # Change to backend directory
    os.chdir(backend_dir)
    
    # Add backend directory to Python path
    sys.path.insert(0, str(backend_dir))
    
    print(f"Starting PocketPM backend server from: {backend_dir}")
    print("Server will be available at: http://localhost:8000")
    print("API documentation will be available at: http://localhost:8000/docs")
    print("\nPress Ctrl+C to stop the server\n")
    
    try:
        # Run the FastAPI server
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "app.main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ], cwd=backend_dir)
    except KeyboardInterrupt:
        print("\nShutting down PocketPM backend server...")
    except Exception as e:
        print(f"Error starting server: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
