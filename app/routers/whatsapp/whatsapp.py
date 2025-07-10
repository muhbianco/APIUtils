import os
import requests

from pprint import pprint

from fastapi import APIRouter, Body, Depends, HTTPException, Path, Query, Request, Security, status
from fastapi_versioning import version

from app.utils.db import get_session
from app.utils.auth import scopes
from app.utils.wuzapi.whatsapp import WuzAPI #TROCAR ESSE IMPORT PARA TROCAR DE BACKEND
from app.utils.typebot.typebot import TypeBot

from app.errors.http_errors import CustomHTTPException

router = APIRouter()

@router.post(
    "/",
    status_code=status.HTTP_200_OK,
    response_model=None,
)
@version(1, 0)
async def events_incoming(
    request: Request,
    db = Depends(get_session),
):
	"""
	Os eventos do Wuzapi vão chegar aqui:
	- ReadReceipt ❌
	- Presence ❌
	- HistorySync ❌
	- ChatPresence ❌
	- Message ✔
	"""
	request_data = await request.json()
	request_data["jid"] = request.query_params.get("jid", None)
	request_data["typebot_public_id"] = request.query_params.get("typebot_public_id", None)

	if not request_data["jid"]:
		raise CustomHTTPException.missing_jid()
	if not request_data["typebot_public_id"]:
		raise CustomHTTPException.missing_typebot_public_id()

	pprint(request_data)

	""" Monta os objetos Whatsapp e Typebot """
	whatsapp_client = WuzAPI(request_data, db)
	typebot_client = TypeBot(whatsapp_client, db)
	
	""" Se a mensagem for do hoster/bot ignora """
	if whatsapp_client.data["from_me"]:
		raise CustomHTTPException.message_from_bot()
	
	""" Inicia o processo TypeBot """
	if whatsapp_client.data["event_type"] == "Message":
		try:
			await typebot_client.run()
		except Exception as e:
			await db.rollback()
			raise e