#!/bin/bash
# Global Pulse - Start Script

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  🌍  Global Pulse - Real-time World Dashboard  ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cleanup() {
    echo -e "\n${RED}Shutting down...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

DIR="$(cd "$(dirname "$0")" && pwd)"

# Start backend
echo -e "${GREEN}▶ Starting backend on :8000...${NC}"
cd "$DIR/backend"
pip install -r requirements.txt -q 2>/dev/null
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# Start frontend
echo -e "${GREEN}▶ Starting frontend on :5173...${NC}"
cd "$DIR/frontend"
npm install --silent 2>/dev/null
npm run dev &
FRONTEND_PID=$!

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Backend:  ${GREEN}http://localhost:8000${NC}"
echo -e "  Frontend: ${GREEN}http://localhost:5173${NC}"
echo -e "  Health:   ${GREEN}http://localhost:8000/health${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "  Press ${RED}Ctrl+C${NC} to stop"
echo ""

wait
