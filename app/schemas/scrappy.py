from pydantic import BaseModel


class ScrappyBase(BaseModel):
    url: str
    file: bool = False
    resume: bool = False


class ScrappyEmails(BaseModel):
    url: str
    full_site: bool = False
    file: bool = False