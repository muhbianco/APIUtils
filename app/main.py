import logging

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi_versioning import VersionedFastAPI
from fastapi.staticfiles import StaticFiles

from app.routers import web_scrappy
from app.routers import minio_controller
from app.routers import auth

from app.utils.auth import get_current_user
from app.utils.db import DB


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("SmartyUtilsAPI")

description = """SmartyUtilsAPI"""
summary = "API de utilidades SmartyFlow"

tags_metadata = [
    {"name": "SmartyScrapper", "description": "Web scrappy"},
    {"name": "SmartyMinIO", "description": "MinIO Controller"},
]

app_base = FastAPI(
    title=description,
    debug=True,
)

app_base.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app_base.include_router(
    auth.router,
    tags=["SmartyAuth"],
    dependencies=[Depends(DB)]
)

# WebScrapp
app_base.include_router(
    web_scrappy.router,
    tags=["SmartyScrapper"],
    prefix="/web_scrappy",
    dependencies=[Depends(get_current_user), Depends(DB)]
)

# MinIO
app_base.include_router(
    minio_controller.router,
    tags=["SmartyMinIO"],
    prefix="/minio",
    dependencies=[Depends(get_current_user), Depends(DB)]
)

app = VersionedFastAPI(
    app_base,
    enable_latest=True,
    summary=summary,
    description=description,
    openapi_tags=tags_metadata,
    debug=True,
)

# @app.on_event("startup")
# async def startup_event():
#     await QuestionNPC.init_driver()

# @app.on_event("shutdown")
# def shutdown_event():
#     QuestionNPC.close()

app.mount("/static", StaticFiles(directory="static"), name="static")
logger.info("Static files mounted at /static")