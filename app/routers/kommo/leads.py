import requests
import logging

from pprint import pformat
from datetime import datetime
from typing_extensions import TypedDict
from typing import List, Annotated, Any, Union, Dict
from urllib.parse import urljoin

from fastapi import APIRouter, Request, status, Body, Query, Path
from fastapi_versioning import version
from fastapi.responses import JSONResponse

from app.schemas.kommo.leads import PathLeads

from app.utils.vars import kommo_base_url, headers

logger = logging.getLogger("AhTerezaAPI")
router = APIRouter()

class ContactResponse(TypedDict):
    id: int
    name: str | None

class TagResponse(TypedDict):
    id: int
    name: str | None
    color: str | None

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
    tags: List[TagResponse] | None
    contacts: List[ContactResponse] | None

class LeadUpdateResponse(TypedDict):
    message: str

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

def get_contact_name(contact_id: int) -> str:
    contact_url = urljoin(kommo_base_url, f"api/v4/contacts/{contact_id}")

    try:
        response_contact = requests.get(contact_url, headers=headers)
        response_contact.raise_for_status()
    except requests.exceptions.RequestException as e:
        logger.error(f"[get_contact_name] Error fetching data: {e}")
        return None
    
    contact_data = response_contact.json()

    return contact_data.get("name", "Unknow Name")

def get_tags_from_lead(lead: dict) -> List[TagResponse]:
    tags: List[TagResponse] = []
    
    for _tag in lead.get("_embedded", {}).get("tags", []):
        tags.append(TagResponse(
            id=_tag.get("id"),
            name=_tag.get("name"),
            color=_tag.get("color"),
        ))

    return tags

def get_contacts_from_lead(lead: dict) -> List[ContactResponse]:
    contacts: List[ContactResponse] = []
    
    for _contact in lead.get("_embedded", {}).get("contacts", []):
        contact_id = _contact.get("id")
        contact_name = _contact.get("name", get_contact_name(contact_id))
        contacts.append(ContactResponse(
            id=contact_id,
            name=contact_name,
        ))

    return contacts





@router.get(
    "/list",
    status_code=status.HTTP_200_OK,
    response_model=List[LeadsResponse],
    tags=["Leads"]
)
@version(1, 0)
def leads(
    request: Request,
    page: Annotated[int, Query(description="Número da página")] = 1,
    limit: Annotated[int, Query(description="Quantidade por página")] = 250,
    query: Annotated[str, Query(description="Permite busca por nomes completos")] = None,
    byName: Annotated[List[str], Query(description="Nomes para busca")] = None,
    byID: Annotated[List[int], Query(description="IDs para busca")] = None,
    byPipeline: Annotated[List[int], Query(description="IDs de Pipeline para busca")] = None,
):
    leads: List[LeadsResponse] = []

    leads_url = urljoin(kommo_base_url, "api/v4/leads")
    leads_params = [
        ("page", page),
        ("limit", limit),
        ("with", "contacts,loss_reason")
    ]
    if byName:
        [leads_params.append(("filter[name][]", _name)) for _name in byName]
    if byID:
        [leads_params.append(("filter[id][]", _id))for _id in byID]
    if byPipeline:
        [leads_params.append(("filter[pipeline_id][]", _id))for _id in byPipeline]
    if query:
        leads_params.append(("query", query))

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

        tags: List[TagResponse] = get_tags_from_lead(_lead)
        contacts: List[ContactResponse] = get_contacts_from_lead(_lead)

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
            tags=tags,
            contacts=contacts,
        ))

    return leads


@router.patch(
    "/update/{leadID}",
    status_code=status.HTTP_200_OK,
    response_model=LeadUpdateResponse,
    tags=["Leads"]
)
@version(1, 0)
def update_lead(
    request: Request,
    leadID: Annotated[int, Path(description="Lead ID")],
    payload: Annotated[PathLeads, Body(description="Dados")],
):
    url = urljoin(kommo_base_url, f"api/v4/leads/{leadID}")
    body: Dict[str, Any] = {}

    if payload.name:
        body["name"] = payload.name
    if payload.status_id:
        body["status_id"] = payload.status_id
    if payload.pipeline_id:
        body["pipeline_id"] = payload.pipeline_id
    if payload.tags:
        body["_embedded"] = {
            "tags": [
                {
                    "id": _tag.id,
                    "name": _tag.name,
                }
                for _tag in payload.tags
            ]
        }

    try:
        response = requests.patch(url, headers=headers, json=body)
        response.raise_for_status()
    except requests.exceptions.HTTPError as http_err:
        return JSONResponse(
            status_code=response.status_code,
            content={"error": f"HTTP error occurred: {http_err}", "response": response.text}
        )
    except requests.exceptions.ConnectionError as conn_err:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"error": f"Connection error occurred: {conn_err}"}
        )
    except requests.exceptions.Timeout as timeout_err:
        return JSONResponse(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            content={"error": f"Timeout error occurred: {timeout_err}"}
        )
    except requests.exceptions.RequestException as req_err:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"error": f"An unexpected error occurred: {req_err}"}
        )
    
    return JSONResponse(status_code=response.status_code, content={"message": "Lead updated successfully"})