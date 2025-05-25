import logging

from datetime import timedelta

from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi_versioning import version

from app.utils.auth import authenticate_user, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, get_users
from app.utils.db import get_session

logger = logging.getLogger("SmartyUtilsAPI")
router = APIRouter()


@router.post("/token")
@version(1, 0)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db = Depends(get_session)):
    users_db = await get_users(db, form_data.username)
    logger.info(f"[login] {users_db}")
    user = authenticate_user(users_db, form_data.username, form_data.password)
    # logger.info(f"[login] {user}")
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"], "perm": user["permissions"]}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

