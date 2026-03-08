#!/bin/bash
# Global Pulse v2 - Development Runner
# Starts both backend (FastAPI) and frontend (Vite) servers

set -e

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🌍 Starting Global Pulse v2..."

# Backend
echo "📡 Starting backend on :8000..."
cd "$PROJECT_DIR/backend"
if [ ! -d "../venv" ]; then
    python3 -m venv ../venv
fi
source ../venv/bin/activate
pip install -q -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Frontend
echo "🖥️  Starting frontend on :5173..."
cd "$PROJECT_DIR/frontend"
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Global Pulse v2 running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
