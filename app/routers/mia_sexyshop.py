import datetime
import uuid
import os
import urllib
import requests

import google.generativeai as gemini_client
from google import genai
from google.genai import types

from typing import Annotated, List, Union
from pprint import pprint, pformat
from bs4 import BeautifulSoup
from pydantic import BaseModel

from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct, VectorParams

from fastapi import (APIRouter, Body, Depends, HTTPException, Path, Query,
                     Request, Security, status)
from fastapi.responses import JSONResponse
from fastapi_versioning import version

from typing_extensions import TypedDict

from app.utils.db import get_session
from app.utils.auth import scopes
from app.utils.prompts import DEFAULT_PERSONA_MIA, DEFAULT_QUESTION_MIA
from app.schemas.woocommerce import GetProductFind


router = APIRouter()

def _qdrant_client() -> QdrantClient:
    return QdrantClient(url="http://qdrant.muhbianco.com.br:6333", api_key=os.environ.get("QDRANT_API_KEY"))

def _gemini_client() -> gemini_client:
    return gemini_client.configure(api_key=os.environ.get("GOOGLE_GEMINI_API_KEY"))

def _gemini_new_client() -> genai.Client:
    return genai.Client(api_key=os.environ.get("GOOGLE_GEMINI_API_KEY"))

def _html_clear(html_content: str) -> str:
    soup = BeautifulSoup(html_content, "html.parser")
    return soup.get_text()


class EmbbeddingAllResponse(BaseModel):
    Status: str
    Products: int

@router.post(
    "/woocommerce/embedding_all_products/",
    status_code=status.HTTP_201_CREATED,
    response_model=EmbbeddingAllResponse,
)
@version(1, 0)
async def embbeding_all_products(
    token: Annotated[None, Security(scopes, scopes=["owner"])],
    db = Depends(get_session),
) -> EmbbeddingAllResponse:
    """
    Busca os produtos do catalogo e adicionar na collection do qdrant
    """
    base_url = os.environ.get("MIA_WOOCOMMERCE_URL")
    token = os.environ.get("MIA_WOOCOMMERCE_KEY")
    url = urllib.parse.urljoin(base_url, "wp-json/wc/v3/products")

    qdrant = _qdrant_client()
    _gemini_client()

    headers = {
        "Content-Type": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Authorization": f"Basic {token}",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0"
    }

    page = 1
    per_page = 20
    woocommerce_data = True
    while woocommerce_data:
        params = {
            "page": page,
            "per_page": per_page,
        }

        response = requests.get(url, headers=headers, params=params)
        woocommerce_data = response.json()

        for _product in woocommerce_data:
            product = f"""Nome: {_product['name']}
                Descrição: {_html_clear(_product['description']).replace('\n\n', '')}
                Tags de busca: {', '.join([item['name'] for item in _product['categories']])}
                Estoque: {_product['stock_quantity']}
            """

            payload = {
                "metadata": {
                    "source": int(_product["id"]),
                },
                "page_content": product,
            }

            embbeding = gemini_client.embed_content(
                model="models/text-embedding-004",
                content=product,
                task_type="retrieval_document",
            )

            point = PointStruct(
                id=payload["metadata"]["source"],
                vector=embbeding['embedding'],
                payload=payload,
            )

            try:
                result = qdrant.upsert(collection_name="sexyshop", wait=True, points=[point])
            except Exception as e:
                HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

        page = page+1

    total_products: int = (page-1)*per_page
    return EmbbeddingAllResponse(**{"Status": "Success", "Products": total_products})

class GetProductReponse(BaseModel):
    Products: str

@router.post(
    "/woocommerce/product_find/",
    status_code=status.HTTP_200_OK,
    response_model=GetProductReponse,
)
@version(1, 0)
async def product_find(
    token: Annotated[None, Security(scopes, scopes=["owner"])],
    payload: Annotated[GetProductFind, Body(title="Busca o produto de acordo com a pergunta do cliente.")],
    db = Depends(get_session),
) -> GetProductReponse:
    """
    Envia a pegunta do cliente para o LLM e retorna os produtos de maiores relevância
    """
    qrant = _qdrant_client()
    _gemini_client()
    conversation_gemini_client = _gemini_new_client()

    while True:
        try:
            response = qrant.search(
                collection_name="sexyshop",
                query_vector=gemini_client.embed_content(
                    model="models/text-embedding-004",
                    content=payload.question,
                    task_type="retrieval_query",
                )["embedding"],
            )
            break
        except Exception:
            continue

    list_products = []
    for _product in response:
        product = _product.payload["page_content"]

        name_start = product.find("Nome: ")+len("Nome: ")
        name_end = product.find("Descrição: ")
        name = product[name_start:name_end].strip()

        desc_start = product.find("Descrição: ")+len("Descrição: ")
        desc_end = product.find("Tags de busca: ")
        desc = product[desc_start:desc_end].strip()

        stock_start = product.find("Estoque: ")+len("Estoque: ")
        stock = product[stock_start:].strip()

        product_data = f"""
====================================    
Nome: {name}
Descrição: {desc}
Estoque: {stock}"""

        list_products.append(product_data)

    prompt = f"""{DEFAULT_PERSONA_MIA}
    {DEFAULT_QUESTION_MIA}

    CATÁLOGO DE PRODUTOS:
    {"".join(list_products)}

    PERGUNTA DO CLIENTE:
    {payload.question}
    """

    generation_config = {
        "temperature": 0.7,
        "top_p": 1,
        "top_k": 1,
        "max_output_tokens": 4096,
    }
    response = conversation_gemini_client.models.generate_content(
        model='models/gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(**generation_config)
    )

    return GetProductReponse(**{"Products": response.text})