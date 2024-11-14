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

from app.utils.global import kommo_base_url, headers

logger = logging.getLogger("AhTerezaAPI")
router = APIRouter()

# kommo_base_url = os.environ["KOMMO-URL"]
# kommo_access_token = os.environ["KOMMO-TOKEN"]
# headers = {
#     "authorization": f"Bearer {kommo_access_token}",
#     "accept": "application/json",
# }


def get_stages(stage_mapping: Union[Dict[int, Dict[int, str]], dict], pipeline_id: int) -> Dict[int, Dict[int, str]]:
    stages_url = urljoin(kommo_base_url, f"api/v4/leads/pipelines/{pipeline_id}/statuses")

    try:
        response_stages = requests.get(stages_url, headers=headers)
        response_stages.raise_for_status()
    except requests.exceptions.RequestException as e:
        logger.error(f"[get_stage_name] Error fetching data: {e}")
        return None
    
    stages_data = response_stages.json()
    stage_mapping[pipeline_id] = {
        stage["id"]: stage["name"]
        for stage in stages_data.get("_embedded", {}).get("statuses", [])
    }
    return stage_mapping

def get_pipelines() -> Dict[int, str]:
    pipelines_url = urljoin(kommo_base_url, "api/v4/leads/pipelines")

    try:
        response_pipelines = requests.get(pipelines_url, headers=headers)
        response_pipelines.raise_for_status()
    except requests.exceptions.RequestException as e:
        logger.error(f"[get_pipelines] Error fetching data: {e}")
        return None
    
    pipelines_data = response_pipelines.json()
    pipeline_mapping: Dict[int, str] = {
        pipeline["id"]: pipeline["name"]
        for pipeline in pipelines_data.get("_embedded", {}).get("pipelines", [])
    }
    return pipeline_mapping

def get_users() -> Dict[int, str]:
    users_url = urljoin(kommo_base_url, "api/v4/users")

    try:
        response_users = requests.get(users_url, headers=headers)
        response_users.raise_for_status()
    except requests.exceptions.RequestException as e:
        logger.error(f"[get_users] Error fetching data: {e}")
        return None
    
    users_data = response_users.json()
    user_mapping: Dict[int, str] = {
        user["id"]: user["name"]
        for user in users_data.get("_embedded", {}).get("users", [])
    }
    return user_mapping


class LeadsResponse(TypedDict):
    created_at: str
    pipeline_id: int
    pipeline_name: str
    lead_id: int
    lead_name: str
    status_id: int
    status_name: str
    responsible_user_id: int
    responsible_user_name: str
    loss_reason_id: int | None
    loss_reason_name: str


@router.get(
    "/leads_list",
    status_code=status.HTTP_200_OK,
    response_model=List[LeadsResponse],
    tags=["Leads"]
)
@version(1, 0)
def leads(
    request: Request,
    page: Annotated[int, Query(description="Número da página")] = 1,
    limit: Annotated[int, Query(description="Quantidade por página")] = 250,
    byName: Annotated[str, Query(description="Nomes para busca")] = "",
    byID: Annotated[int, Query(description="IDs para busca")] = None,
):
    leads: List[LeadsResponse] = []

    leads_url = urljoin(kommo_base_url, "api/v4/leads")
    leads_params = [
        ("page", page),
        ("limit", limit),
        ("with", "contacts,loss_reason")
    ]
    if byName:
        leads_params.append(("filter[name][]", byName))
    if byID:
        leads_params.append(("filter[id][]", byID))

    try:
        response_leads = requests.get(leads_url, headers=headers, params=leads_params)
        response_leads.raise_for_status()
        # logger.info(f"Status Code: {response_leads.status_code}")
        # logger.info(f"Response URL: {response_leads.url}")
        # logger.info(f"Response Content: {response_leads.text}")
        leads_data = response_leads.json()
    except requests.exceptions.HTTPError as e:
        logger.error(f"[leads] HTTP error: {e}")
        logger.error(f"Response Content: {response_leads.text}")
        return leads
    except requests.exceptions.RequestException as e:
        logger.error(f"[leads] Error fetching data: {e}")
        return leads
    except Exception as e:
        logger.error(f"[leads] Error: {e}")
        return leads
    
    pipeline_mapping = get_pipelines()
    stage_mapping = {}
    user_mapping = get_users()

    for _lead in leads_data.get("_embedded", {}).get("leads", []):

        pipeline_id = _lead.get("pipeline_id")
        status_id = _lead.get("status_id")
        if not pipeline_id in stage_mapping:
            stage_mapping = get_stages(stage_mapping, pipeline_id)
        created_at = datetime.fromtimestamp(_lead.get("created_at")).strftime("%d-%m-%Y %H:%M:%S")
        responsible_user_id=_lead.get("responsible_user_id")
        loss_reason_name = "Unknow Reason"
        loss_reason_list = _lead.get("_embedded", {}).get("loss_reason", [])
        if loss_reason_list:
            loss_reason_name = loss_reason_list[0].get("name", "Unknown Reason")

        leads.append(LeadsResponse(
            created_at=created_at,
            pipeline_id=pipeline_id,
            pipeline_name=pipeline_mapping.get(pipeline_id, "Unknown Pipeline"),
            lead_id=_lead.get("id"),
            lead_name=_lead.get("name"),
            status_id=status_id,
            status_name=stage_mapping.get(pipeline_id).get(status_id, "Unknown Stage"),
            responsible_user_id=responsible_user_id,
            responsible_user_name=user_mapping.get(responsible_user_id, "Unknow User"),
            loss_reason_id=_lead.get("loss_reason_id"),
            loss_reason_name=loss_reason_name,
        ))

    return leads


@router.patch(
    "/update_lead",
    status_code=status.HTTP_200_OK,
    response_model=List[LeadsResponse],
    tags=["Leads"]
)
@version(1, 0)
def updadate_lead(
    request: Request,
):
    pass