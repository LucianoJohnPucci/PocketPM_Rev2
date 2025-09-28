#!/usr/bin/env python3
"""
Comprehensive startup script for PocketPM application.
This script can start both backend and frontend servers.
"""

import os
import sys
import subprocess
import threading
import time
from pathlib import Path

def run_backend():
    """Run the backend server."""
    script_dir = Path(__file__).parent.absolute()
    backend_dir = script_dir / "backend"
    
    os.chdir(backend_dir)
    sys.path.insert(0, str(backend_dir))
    
    print("🚀 Starting PocketPM Backend Server...")
    print("   Backend API: http://localhost:8000")
    print("   API Docs: http://localhost:8000/docs")
    
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "app.main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ], cwd=backend_dir)
    except Exception as e:
        print(f"❌ Backend server error: {e}")

def run_frontend():
    """Run the frontend server."""
    script_dir = Path(__file__).parent.absolute()
    frontend_dir = script_dir / "frontend"
    
    print("🚀 Starting PocketPM Frontend Server...")
    print("   Frontend App: http://localhost:3000")
    
    # Small delay to let backend start first
    time.sleep(2)
    
    try:
        subprocess.run(["npm", "start"], cwd=frontend_dir)
    except Exception as e:
        print(f"❌ Frontend server error: {e}")

def main():
    print("🎯 PocketPM Application Startup")
    print("=" * 40)
    
    if len(sys.argv) > 1:
        mode = sys.argv[1].lower()
        if mode == "backend":
            run_backend()
        elif mode == "frontend":
            run_frontend()
        else:
            print("Usage: python start_servers.py [backend|frontend]")
            print("Or run without arguments to start both servers")
            return 1
    else:
        print("Starting both Backend and Frontend servers...")
        print("Press Ctrl+C to stop all servers\n")
        
        # Start backend in a separate thread
        backend_thread = threading.Thread(target=run_backend, daemon=True)
        backend_thread.start()
        
        # Give backend time to start
        time.sleep(3)
        
        # Start frontend in main thread
        try:
            run_frontend()
        except KeyboardInterrupt:
            print("\n🛑 Shutting down PocketPM servers...")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
