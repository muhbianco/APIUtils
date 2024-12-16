import requests
import logging

from typing_extensions import TypedDict
from typing import List, Annotated
from urllib.parse import urljoin

from fastapi import APIRouter, Request, status, Query, Path
from fastapi_versioning import version

from app.schemas.kommo.tags import EntityTypes

from app.utils.vars import kommo_base_url, headers

logger = logging.getLogger("AhTerezaAPI")
router = APIRouter()


class TagsResponse(TypedDict):
    id: int
    name: str

@router.get(
    "/list/{entityType}",
    status_code=status.HTTP_200_OK,
    response_model=List[TagsResponse],
    tags=["Tags"]
)
@version(1, 0)
def leads(
    request: Request,
    entityType: Annotated[EntityTypes, Path(description="Tipo de tags")],
    page: Annotated[int, Query(description="Número da página")] = 1,
    limit: Annotated[int, Query(description="Quantidade por página")] = 250,
    query: Annotated[str, Query(description="Permite busca por nomes completos")] = None,
    byName: Annotated[str, Query(description="Nomes para busca")] = None,
    byID: Annotated[List[int], Query(description="IDs para busca")] = None,
):
    tags: List[TagsResponse] = []

    tags_url = urljoin(kommo_base_url, f"api/v4/{entityType.value}/tags")
    tags_params = [
        ("page", page),
        ("limit", limit),
    ]
    if query:
        tags_params.append(("query", query))
    if byID:
        [tags_params.append(("filter[id][]", _id)) for _id in byID]
    if byName:
        tags_params.append(("filter[name]", byName))

    logger.info(f"Params: {tags_params}")

    try:
        response_tags = requests.get(tags_url, headers=headers, params=tags_params)
        response_tags.raise_for_status()
        logger.info(f"Status Code: {response_tags.status_code}")
        logger.info(f"Response URL: {response_tags.url}")
        logger.info(f"Response Content: {response_tags.text}")
        tags_data = response_tags.json()
    except requests.exceptions.HTTPError as e:
        logger.error(f"[leads] HTTP error: {e}")
        logger.error(f"Response Content: {response_tags.text}")
        return tags
    except requests.exceptions.RequestException as e:
        logger.error(f"[leads] Error fetching data: {e}")
        return tags
    except Exception as e:
        logger.error(f"[leads] Error: {e}")
        return tags

    for _tag in tags_data.get("_embedded", {}).get("tags", []):
        tags.append(TagsResponse(
            id=_tag.get("id"),
            name=_tag.get("name")
        ))
    
    return tags