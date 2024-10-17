from pydantic import BaseModel


class ScrappyBase(BaseModel):
    url: str