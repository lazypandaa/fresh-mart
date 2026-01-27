from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.tracking import tracker
import json

class TrackingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Get user from token if available
        user_id = getattr(request.state, 'user_id', None)
        
        response = await call_next(request)
        
        # Only track auth actions automatically
        if request.url.path.startswith("/api/auth"):
            event_data = {
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code
            }
            tracker.track_event(user_id, "auth_action", event_data)
        
        return response