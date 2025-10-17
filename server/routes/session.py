from fastapi import APIRouter
import uuid

from schemas import SessionResponse

router = APIRouter(prefix="/api/session", tags=["Session"])

@router.post("", response_model=SessionResponse)
def create_session():
    session_id = str(uuid.uuid4())
    return SessionResponse(session_id=session_id)