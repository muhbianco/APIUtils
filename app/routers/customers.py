import datetime
import uuid
from typing import Annotated, List

from fastapi import (APIRouter, Body, Depends, HTTPException, Path, Query,
                     Request, Security, status)
from fastapi.responses import JSONResponse
from fastapi_versioning import version

from typing_extensions import TypedDict

from app.utils.db import get_session
from app.utils.auth import scopes

router = APIRouter()

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
)
@version(1, 0)
async def create_customer(
    # token: Annotated[
    #     JWTAuthorizationCredentials,
    #     Security(scoped_auth, scopes=["owner", "accountcode::add"]),
    # ],
    # payload: Annotated[AccountcodeBase, Body(title="Dados da nova conta.")],
    token: Annotated[None,Security(scopes, scopes=["customer::read"])],
    db = Depends(get_session),
):
    """
    Cria uma nova conta na plataforma.
    """
    
    
    
    return {"Status": "Success", "Accountcode": "teste"}