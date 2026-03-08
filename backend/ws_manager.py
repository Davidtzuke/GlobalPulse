"""WebSocket connection manager for Global Pulse v2.

Manages active WebSocket connections and provides broadcast
functionality for pushing real-time updates to all connected clients.
"""

import json
import logging
from datetime import datetime
from typing import Any, List

from fastapi import WebSocket

from schemas import LiveUpdate

logger = logging.getLogger(__name__)


class ConnectionManager:
    """Manages WebSocket connections and broadcasts updates."""

    def __init__(self) -> None:
        self.connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket) -> None:
        """Accept and register a new WebSocket connection."""
        await websocket.accept()
        self.connections.append(websocket)
        logger.info("WebSocket connected. Total connections: %d", len(self.connections))

    def disconnect(self, websocket: WebSocket) -> None:
        """Remove a WebSocket connection from the active list."""
        if websocket in self.connections:
            self.connections.remove(websocket)
        logger.info("WebSocket disconnected. Total connections: %d", len(self.connections))

    async def broadcast(self, message: dict) -> None:
        """Send a JSON message to all connected clients.

        Automatically removes clients that have disconnected.
        """
        disconnected: List[WebSocket] = []
        for connection in self.connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)
                logger.warning("Failed to send to a client; marking for removal.")

        for conn in disconnected:
            self.disconnect(conn)

    async def broadcast_update(self, update_type: str, data: Any) -> None:
        """Create a LiveUpdate envelope and broadcast it to all clients.

        Args:
            update_type: One of 'flight', 'earthquake', 'conflict', 'news', 'stats'.
            data: The payload data to include in the update.
        """
        update = LiveUpdate(
            type=update_type,
            data=data,
            timestamp=datetime.utcnow(),
        )
        await self.broadcast(update.model_dump(mode="json"))


# Singleton instance used across the application
manager = ConnectionManager()
