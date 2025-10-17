from fastapi import HTTPException, Header
from typing import Optional

def get_session_id(x_session_id: Optional[str] = Header(None)):
    if not x_session_id:
        raise HTTPException(status_code=400, detail="Session ID required")
    return x_session_id