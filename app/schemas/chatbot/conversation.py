from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class FreeConversationBase(BaseModel):
    chat_id: int
    user_name: str
    question: str

class ReadDocumentsBase(BaseModel):
    chat_id: int
    user_name: str
    url_document: str
    type_document: str
    mime_type: str
    question: Optional[str] = None