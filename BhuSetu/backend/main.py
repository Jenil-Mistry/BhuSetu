"""
BhuSetu Backend Root Compatibility Entrypoint.
Imports the modular FastAPI application factory from app.main.
Ensures 100% backward compatibility with 'uvicorn main:app --reload'.
"""

import os
import uvicorn
from app.main import app

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
