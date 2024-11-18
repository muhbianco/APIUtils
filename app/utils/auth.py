import os
import logging
import asyncio

from datetime import datetime, timedelta
from typing import Union

from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer


logger = logging.getLogger("SmartyUtilsAPI")
# Configurações (idealmente, você colocaria isso em um arquivo de configuração ou variáveis de ambiente)
SECRET_KEY = os.environ["JWT-API-KEY"]
ALGORITHM = os.environ["JWT-ALGORITHM"]
ACCESS_TOKEN_EXPIRE_MINUTES = 0


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_users(db):
    sql = "SELECT * FROM users"
    users = await db.fetch(sql=sql)
    users_mapping = {
        user["user_name"]: {
            "username": user["user_name"],
            "full_name": user["full_name"],
            "email": user["email"],
            "hashed_password": user["pass"],
            "disabled": user["disable"]
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
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Não foi possível validar as credenciais",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user(fake_users_db, username)
    if user is None:
        raise credentials_exception
    return user
