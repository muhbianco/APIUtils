from typing import Annotated

from fastapi import (APIRouter, Depends, Security, status)
from fastapi_versioning import version


from app.utils.db import get_session
from app.utils.auth import scopes

router = APIRouter()

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
)
@version(1, 0)
async def create_customer(
    # payload: Annotated[AccountcodeBase, Body(title="Dados da nova conta.")],
    token: Annotated[None, Security(scopes, scopes=["customer::read"])],
    db = Depends(get_session),
):
    """
    Cria uma nova conta na plataforma.
    """
    
    
    
    return {"Status": "Success", "Accountcode": "teste"}