import uuid
import os
import re
import requests
import zipfile
import shutil
import tempfile
import logging
import json
import base64
import mimetypes

from minio import Minio
from datetime import datetime
from typing_extensions import TypedDict
from typing import List, Annotated, Any, Union, Tuple
from pprint import pprint, pformat
from urllib.parse import urlencode, urljoin, urlparse, parse_qs, urlunparse, unquote, quote

from fastapi import APIRouter, Request, status, Body, HTTPException, Query, UploadFile, File, Path
from fastapi_versioning import version
from fastapi.responses import FileResponse, JSONResponse

from app.schemas.minio import PutMinIOObject
from app.utils.content_types import content_types as allowed_types

logger = logging.getLogger("SmartyUtilsAPI")
router = APIRouter()

def copy_file(file: UploadFile, temp_dir: str, file_name: str) -> str:
    temp_file_path = os.path.join(temp_dir, file_name)
    try:
        with open(temp_file_path, "wb") as temp_file:
            shutil.copyfileobj(file, temp_file)

    except AttributeError:
        with open(temp_file_path, "wb") as temp_file:
            temp_file.write(file)

    except Exception as e:
        logger.error(f"[copy_file]: Error copying file {file_name} to {temp_dir}. Details: {e}")
        raise e

    return temp_file_path

def unzip_files(file: UploadFile, temp_dir: str) -> list:
    temp_file_path = os.path.join(temp_dir, file.filename)
    try:
        with open(temp_file_path, "wb") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
        
        with zipfile.ZipFile(temp_file_path, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)
            logger.info(f"[unzip_files] Extracted files to {temp_dir}")
            file_list = zip_ref.namelist()
            logger.info(f"[unzip_files] Files in the archive: {file_list}")

        return file_list

    except Exception as e:
        logger.error(f"[unzip_files] Error unzipping file {file.filename}. Details: {e}")
        raise e
    
def minio_put_object(client: Minio, file_path: str, file_name: str, bucket_name:str, folder_name: str) -> None:
    try:
        with open(file_path, "rb") as _file_data:
            client.put_object(
                bucket_name=bucket_name,
                object_name=f"{folder_name}/{file_name}",
                data=_file_data,
                length=os.path.getsize(file_path),
                content_type="application/octet-stream"
            )
        logger.info(f"[minio_put_object] Uploaded {file_name} to MinIO.")
    except Exception as e:
        logger.error(f"[minio_put_object] Upload error {file_name}. Details: {e}")
        raise e
    
def get_minio_client() -> Minio:
    return Minio(
        os.environ["MINIO-URL"],
        access_key=os.environ["MINIO-ACCESS-KEY"],
        secret_key=os.environ["MINIO-SECRET-KEY"],
    )

@router.put(
    "/put_object/{bucket_name}/{folder_name}",
    status_code=status.HTTP_200_OK,
    response_model=None,
)
@version(1, 0)
def put_object(
    request: Request,
    files: Annotated[List[UploadFile], File()],
    bucket_name: Annotated[str, Path(description="Nome do bucket")],
    folder_name: Annotated[str, Path(description="Nome do bucket")]
) -> Union[JSONResponse, HTTPException]:

    not_allowed_files: List[str] = []
    response_urls: List[str] = []
    
    client = get_minio_client()

    try:
        for file in files:
            file_content_type = file.headers["content-type"]
            if file_content_type == "application/zip":
                with tempfile.TemporaryDirectory() as unziped_files_path:
                    unziped_files = unzip_files(file, unziped_files_path)
                    for _file_name in unziped_files:
                        _file_path = os.path.join(unziped_files_path, _file_name)
                        minio_put_object(client, _file_path, _file_name, bucket_name, folder_name)
                        response_urls.append(quote(f"{os.environ['MINIO-URL']}/api/v1/buckets/{bucket_name}/objects/download?preview=true&prefix={folder_name}/{_file_name}&version_id=null"))
            elif file_content_type not in allowed_types:
                not_allowed_files.append(file.headers["filename"])
                continue

            with tempfile.TemporaryDirectory() as file_path:
                local_file_path = copy_file(file.file, file_path, file.filename)
                minio_put_object(client, local_file_path, file.filename, bucket_name, folder_name)
                response_urls.append(quote(f"{os.environ['MINIO-URL']}/api/v1/buckets/{bucket_name}/objects/download?preview=true&prefix={folder_name}/{file.filename}&version_id=null"))

        return JSONResponse(status_code=200, content={"details": response_urls})
    except Exception as e:
        return HTTPException(status_code=400, content={"detail": str(e)})


@router.put(
    "/url/put_object",
    status_code=status.HTTP_200_OK,
    response_model=None,
)
@version(1, 0)
def put_object(
    request: Request,
    payload: Annotated[PutMinIOObject, Body(title="Numero/RemoteJid | URL do arquivo | Nome da intância do EvolutionAPI")],
) -> Union[JSONResponse, HTTPException]:

    client = get_minio_client()
    bucket_name = "typebot"
    folder_name = payload.remoteJid

    find_messages_evo_url = urljoin(os.environ['EVO-API-URL'], f"/chat/findMessages/{payload.evo_instance_name}")
    get_base64_evo_url = urljoin(os.environ['EVO-API-URL'], f"/chat/getBase64FromMediaMessage/{payload.evo_instance_name}")
    evo_headers = {
        "apikey": os.environ["EVO-API-KEY"],
        "Content-Type": "application/json"
    }
    find_messages_evo_body = {
        "where": {
            "key": {
                "remoteJid": f"{payload.remoteJid}"
            }
        }
    }
    find_messages_evo_response = requests.post(url=find_messages_evo_url, headers=evo_headers, json=find_messages_evo_body)

    mime_type = None
    message_id = None
    for message in json.loads(find_messages_evo_response.text):
        if message["key"]["remoteJid"] == payload.remoteJid and "messageType" in message:
            message_type = message["messageType"]
            if "url" in message["message"][message_type]:
                if message["message"][message_type]["url"] == payload.url:
                    message_id = message["key"]["id"]
                    mime_type = message["message"][message_type]["mimetype"]
                    break

    # logger.error(message_id)
    if not message_id:
        return HTTPException(status_code=404, content={"detail": "URL or RemoteJid not found"})
    
    get_base64_evo_body = {
        "message": {
            "key": {
                "id": message_id
            }
        },
        "convertToMp4": False
    }
    get_base64_evo_response = requests.post(url=get_base64_evo_url, headers=evo_headers, json=get_base64_evo_body)
    base64_evo = json.loads(get_base64_evo_response.text)["base64"]
    file_data = base64.b64decode(base64_evo)
    file_extension = mimetypes.guess_extension(mime_type)
    file_name = f"{uuid.uuid4()}{file_extension}"
    with tempfile.TemporaryDirectory() as file_path:
        local_file_path = copy_file(file_data, file_path, file_name)
        minio_put_object(client, local_file_path, file_name, bucket_name, folder_name)
        url_response = quote(f"https://{os.environ['MINIO-URL']}/api/v1/buckets/{bucket_name}/objects/download?preview=true&prefix={folder_name}/{file_name}&version_id=null")

    return JSONResponse(status_code=200, content=url_response)