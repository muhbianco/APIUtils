import os
import requests
import urllib

from pprint import pprint

from fastapi import APIRouter, Body, Depends, HTTPException, Path, Query, Request, Security, status
from fastapi_versioning import version

from app.utils.db import get_session
from app.utils.auth import scopes
from app.utils.wuzapi import whatsapp #TROCAR ESSE IMPORT PARA TROCAR DE BACKEND
from app.utils.typebot import typebot

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

	data = await whatsapp.tools.incoming_normalizer(request_data)

	if data["from_me"]:
		raise CustomHTTPException.message_from_bot()

	pprint(data)

	if data["event_type"] == "Message":

		typebot_session = await typebot.sessions.get_active_session(data, db)

		if not typebot_session:
			
			typebot_response = await typebot.sessions.startChat(data, db)
			messages = await typebot.tools.messages_normalizer(typebot_response)
			await whatsapp.tools.sender(messages)
