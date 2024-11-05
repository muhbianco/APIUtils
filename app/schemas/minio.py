from pydantic import BaseModel

class PutMinIOObject(BaseModel):
    remoteJid: str
    url: str
    evo_instance_name: str