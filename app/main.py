
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_versioning import VersionedFastAPI
from fastapi.staticfiles import StaticFiles

from app.routers.kommo import leads

import logging



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

# WebScrapp
app_base.include_router(
    leads.router,
    tags=["AhTerezaKOMMO"],
    prefix="/kommo",
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