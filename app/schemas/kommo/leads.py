from pydantic import BaseModel
from typing import List

class TagLeads(BaseModel):
    id: int
    name: str

class PathLeads(BaseModel):
    name: str | None = None
    status_id: int | None = None
    pipeline_id: int | None = None
    tags: List[TagLeads] | None = None