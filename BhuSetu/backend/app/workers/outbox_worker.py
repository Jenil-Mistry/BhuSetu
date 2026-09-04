"""
Asynchronous Outbox Event Worker.
Processes pending outbox_events, delivers alerts, and coordinates external adapter calls.
"""

import time
import logging
from typing import Optional
from app.repositories.outbox_repo import outbox_repo
from app.integrations.mock_adapters import mock_notifications, mock_pfms

logger = logging.getLogger("bhusetu.worker")


class OutboxWorker:

    def __init__(self, poll_interval_seconds: float = 2.0):
        self.poll_interval = poll_interval_seconds
        self.running = False

    def process_pending_events(self) -> int:
        """Processes one batch of pending outbox events."""
        events = outbox_repo.fetch_pending_events(limit=10)
        processed = 0

        for event in events:
            event_id = event["id"]
            event_type = event["event_type"]
            payload = event.get("payload", {})

            try:
                logger.info(f"Processing outbox event {event_id} ({event_type})")

                if "notification" in event_type or "workflow" in event_type:
                    # Dispatch SMS / Email alert
                    mock_notifications.push({
                        "recipient": payload.get("actor_id", "district-officer"),
                        "message": f"BhuSetu Notice: Project {payload.get('project_code')} transition to {payload.get('to_stage')}",
                    })

                elif "payment" in event_type:
                    # Check DBT/PFMS status
                    mock_pfms.push(payload)

                outbox_repo.mark_completed(event_id)
                processed += 1
            except Exception as exc:
                logger.error(f"Failed to process event {event_id}: {exc}")

        return processed

    def run_loop(self, max_iterations: Optional[int] = None):
        """Runs polling loop."""
        self.running = True
        logger.info("Outbox worker started.")
        iterations = 0

        while self.running:
            count = self.process_pending_events()
            if count > 0:
                logger.info(f"Processed {count} outbox events.")

            iterations += 1
            if max_iterations and iterations >= max_iterations:
                break
            time.sleep(self.poll_interval)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    worker = OutboxWorker(poll_interval_seconds=3.0)
    worker.run_loop()
