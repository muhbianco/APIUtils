import logging

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi_versioning import VersionedFastAPI
from fastapi.staticfiles import StaticFiles

from app.routers.kommo import leads
from app.routers.kommo import pipelines
from app.routers.kommo import tags
from app.routers import auth

from app.utils.auth import get_current_user


logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("AhTerezaAPI")

description = """AhTerezaAPI"""
summary = "API de utilidades AhTereza"

tags_metadata = [
    {"name": "AhTerezaKOMMO", "description": "Tratamento de dados AhTereza KOMMO"},
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
    tags=["AhTerezaAUTH"]
)


app_base.include_router(
    leads.router,
    tags=["AhTerezaKOMMO"],
    prefix="/kommo/leads",
    dependencies=[Depends(get_current_user)]
)
app_base.include_router(
    pipelines.router,
    tags=["AhTerezaKOMMO"],
    prefix="/kommo",
    dependencies=[Depends(get_current_user)]
)
app_base.include_router(
    tags.router,
    tags=["AhTerezaKOMMO"],
    prefix="/kommo/tags",
    dependencies=[Depends(get_current_user)]
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

# app.mount("/static", StaticFiles(directory="static"), name="static")
# logger.info("Static files mounted at /static")