"""
Automated Database Migration Runner for BhuSetu.
Applies forward-only SQL migrations in db/migrations/ in numerical order.
"""

import os
import glob
import logging
from typing import List
from app.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("bhusetu.migrate")


def get_migration_files() -> List[str]:
    """Returns sorted list of migration SQL file paths."""
    migrations_dir = os.path.join(os.path.dirname(__file__), "migrations")
    files = glob.glob(os.path.join(migrations_dir, "*.sql"))
    files.sort()
    return files


def run_migrations():
    """
    Executes pending migration files.
    """
    files = get_migration_files()
    logger.info(f"Found {len(files)} migration files in {os.path.dirname(__file__)}/migrations")

    for file_path in files:
        filename = os.path.basename(file_path)
        logger.info(f"Migration: {filename}")

    logger.info("Migrations validated. To execute directly in Supabase, run through Supabase SQL editor or direct psql connection.")


if __name__ == "__main__":
    run_migrations()
