from pydantic import BaseModel

class PutMinIOObject(BaseModel):
    url: str 