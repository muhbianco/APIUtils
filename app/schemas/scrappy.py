from pydantic import BaseModel
from enum import Enum



class TypeResponse(str, Enum):
    file = "file"
    json = "json"

class ScrappyEmails(BaseModel):
    url: str
    full_site: bool = False
    type_reponse: TypeResponse

class ScrappyPrices(BaseModel):
    url: str
    type_reponse: TypeResponse