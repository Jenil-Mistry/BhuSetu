"""
Application middleware for request correlation, structured access logging, and performance timing.
"""

import time
import uuid
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger("bhusetu.access")


class CorrelationIdMiddleware(BaseHTTPMiddleware):
    """
    Ensures every request has a unique correlation ID for end-to-end tracing and auditing.
    """

    async def dispatch(self, request: Request, call_next):
        correlation_id = request.headers.get("X-Correlation-ID") or str(uuid.uuid4())
        request.state.correlation_id = correlation_id

        start_time = time.perf_counter()
        
        try:
            response = await call_next(request)
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            
            response.headers["X-Correlation-ID"] = correlation_id
            response.headers["X-Response-Time-Ms"] = str(duration_ms)
            
            # Non-sensitive access log
            logger.info(
                f"[{correlation_id}] {request.method} {request.url.path} "
                f"status={response.status_code} duration={duration_ms}ms"
            )
            return response
        except Exception as exc:
            duration_ms = round((time.perf_counter() - start_time) * 1000, 2)
            logger.error(
                f"[{correlation_id}] {request.method} {request.url.path} "
                f"FAILED error={str(exc)} duration={duration_ms}ms"
            )
            raise exc
