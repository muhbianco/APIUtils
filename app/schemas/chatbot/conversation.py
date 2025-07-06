from pydantic import BaseModel
from uuid import UUID

class FreeConversationBase(BaseModel):
    chat_id: int
    user_name: str
    question: str
