import os
import logging
import asyncio
import json

from datetime import datetime, timedelta
from typing import Union

from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, SecurityScopes

from app.utils.db import get_session


logger = logging.getLogger("UtilsAPI")
SECRET_KEY = os.environ["JWT-API-KEY"]
ALGORITHM = os.environ["JWT-ALGORITHM"]
ACCESS_TOKEN_EXPIRE_MINUTES = 0

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Não foi possível validar as credenciais",
    headers={"WWW-Authenticate": "Bearer"},
)

async def get_users(db, user_name):
    sql = """
    SELECT * FROM users u
    LEFT JOIN users_permissions up ON up.user_id = u.id
    WHERE u.user_name = %s
    AND u.disable = 0
    """
    users = await db.fetch(sql=sql, args=(user_name, ))
    users_mapping = {
        user["user_name"]: {
            "username": user["user_name"],
            "full_name": user["full_name"],
            "email": user["email"],
            "hashed_password": user["pass"],
            "permissions": json.loads(user["permission"])
        }
        for user in users
    }
    return users_mapping

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return user_dict

def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False

    return user

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db = Depends(get_session)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        permissions: list = payload.get("perm")
        if username is None:
            logging.info("01")
            raise credentials_exception
    except JWTError as e:
        logging.info(f"02 {e}")
        raise credentials_exception
    
    return {"username": username, "permissions": permissions}

async def scopes(security_scopes: SecurityScopes, token: str = Depends(oauth2_scheme), db = Depends(get_session)):
    user = await get_current_user(token, db)
    user_scopes: list = user["permissions"]
    # logging.info(f"[scopes] user scopes {user['permissions']}")
    # logging.info(f"[scopes] required scopes {security_scopes.scopes}")

    for scope in security_scopes.scopes:
        if "::" not in scope:
            if scope in user_scopes:
                return token
    
    user_permissions: dict = {}
    for user_scope in user_scopes:
        module, actions = user_scope.split("::")
        actions = actions.split(",")
        if module not in user_permissions:
            user_permissions[module] = []
        user_permissions[module].extend(actions)

    for scope in security_scopes.scopes:
        if "::" in scope:
            scope_module, scope_actions = scope.split("::")
            scope_actions_list = scope_actions.split(",")

            if scope_module not in user_permissions:
                raise credentials_exception

            if [
                sa
                for sa in scope_actions_list
                if sa not in user_permissions[scope_module]
            ]:
                raise credentials_exception
    return token