from pydantic import BaseModel


class ScrappyBase(BaseModel):
    url: str
    file: bool = False
    resume: bool = False