import uuid
import os
import re
import requests
import logging
import json


from datetime import datetime, date
from typing_extensions import TypedDict
from typing import List, Annotated, Any, Union, Tuple, Dict
from pprint import pprint, pformat
from urllib.parse import urlencode, urljoin, urlparse, parse_qs, urlunparse, unquote, quote

from fastapi import APIRouter, Request, status, Body, HTTPException, Query, UploadFile, File, Path
from fastapi_versioning import version
from fastapi.responses import FileResponse, JSONResponse

from app.utils.vars import kommo_base_url, headers

logger = logging.getLogger("AhTerezaAPI")
router = APIRouter()


def get_accounts() -> Dict[int, str]:
    accounts_url = urljoin(kommo_base_url, "api/v4/account")

    try:
        response_accounts = requests.get(accounts_url, headers=headers)
        response_accounts.raise_for_status()
    except requests.exceptions.RequestException as e:
        logger.error(f"[get_users] Error fetching data: {e}")
        return None
    
    accounts_data = response_accounts.json()
    account_mapping: Dict[int, str] = {
        accounts_data["id"]: accounts_data["name"]
    }
    return account_mapping


class StagesResponse(TypedDict):
    id: int
    name: str

class PipelinesResponse(TypedDict):
    id: int
    name: str
    account_id: int
    account_name: str
    stages: List[StagesResponse]


@router.get(
    "/pipelines/list",
    status_code=status.HTTP_200_OK,
    response_model=List[PipelinesResponse],
    tags=["Pipelines and Stages"]
)
@version(1, 0)
def pipelines(
    request: Request,
):
    pipelines: List[PipelinesResponse] = []

    pipelines_url = urljoin(kommo_base_url, "api/v4/leads/pipelines")

    try:
        response_pipelines = requests.get(pipelines_url, headers=headers)
        response_pipelines.raise_for_status()
        # logger.info(f"Status Code: {response_pipelines.status_code}")
        # logger.info(f"Response URL: {response_pipelines.url}")
        # logger.info(f"Response Content: {response_pipelines.text}")
        pipelines_data = response_pipelines.json()
    except requests.exceptions.HTTPError as e:
        logger.error(f"[pipelines] HTTP error: {e}")
        logger.error(f"Response Content: {response_pipelines.text}")
        return pipelines
    except requests.exceptions.RequestException as e:
        logger.error(f"[pipelines] Error fetching data: {e}")
        return pipelines
    except Exception as e:
        logger.error(f"[pipelines] Error: {e}")
        return pipelines
    
    account_mapping = get_accounts()
    
    for _pipeline in pipelines_data.get("_embedded", {}).get("pipelines", []):
        stages: List[StagesResponse] = []
        for _stage in _pipeline.get("_embedded", {}).get("statuses", []):
            stages.append(StagesResponse(
                id=_stage.get("id"),
                name=_stage.get("name"),
            ))
        account_id = _pipeline.get("account_id")
        pipelines.append(PipelinesResponse(
            id=_pipeline.get("id"),
            name=_pipeline.get("name"),
            account_id=account_id,
            account_name=account_mapping.get(account_id, "Unknow Account"),
            stages=stages,
        ))
    return pipelines


@router.get(
    "/stages/list",
    status_code=status.HTTP_200_OK,
    response_model=List[StagesResponse],
    tags=["Pipelines and Stages"]
)
@version(1, 0)
def stages(
    request: Request,
    pipelineID: Annotated[int, Query(description="ID do Pipeline")],
    # page: Annotated[int, Query(description="Número da página")] = 1,
    # limit: Annotated[int, Query(description="Quantidade por página")] = 250,
):
    stages: List[StagesResponse] = []

    stages_url = urljoin(kommo_base_url, f"api/v4/leads/pipelines/{pipelineID}/statuses")

    try:
        response_stages = requests.get(stages_url, headers=headers)
        response_stages.raise_for_status()
        # logger.info(f"Status Code: {response_stages.status_code}")
        # logger.info(f"Response URL: {response_stages.url}")
        # logger.info(f"Response Content: {response_stages.text}")
        stages_data = response_stages.json()
    except requests.exceptions.HTTPError as e:
        logger.error(f"[pipelines] HTTP error: {e}")
        logger.error(f"Response Content: {response_stages.text}")
        return stages
    except requests.exceptions.RequestException as e:
        logger.error(f"[pipelines] Error fetching data: {e}")
        return stages
    except Exception as e:
        logger.error(f"[pipelines] Error: {e}")
        return stages
    
    for _stages in stages_data.get("_embedded", {}).get("statuses", []):
        stages.append(PipelinesResponse(
            id=_stages.get("id"),
            name=_stages.get("name"),
        ))
    return stages