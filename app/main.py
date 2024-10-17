
from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_versioning import VersionedFastAPI

from app.routers import web_scrappy

import asyncio

load_dotenv()

description = """MuhUtilsAPI"""
summary = "API de utilidades Muhbianco"

tags_metadata = [
    {"name": "MuhScrapper", "description": "Web scrappy"},
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
    web_scrappy.router,
    tags=["MuhScrapper"],
    prefix="/web_scrappy",
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
