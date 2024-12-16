from pydantic import BaseModel
from enum import Enum

class EntityTypes(str, Enum):
    LEADS       = "leads"
    CONTACTS    = "contacts"
    COMPANIES   = "companies"