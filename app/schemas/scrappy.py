from pydantic import BaseModel
from enum import Enum
from typing import List



class TypeResponse(str, Enum):
    file = "file"
    json = "json"


class EditalsResponse(str, Enum):
    PDF = "pdf"
    TXT = "txt"


class EditalsPayload(BaseModel):
    start_date: str | None = None
    type_response: EditalsResponse = EditalsResponse.PDF
    filter_tags: List[str] = []
    response_email: str | None = None
    existing_file: str | None = None
    

class ScrappyEmails(BaseModel):
    url: str
    full_site: bool = False
    type_reponse: TypeResponse