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
	try:
		request_data = await request.json()

		""" Monta os objetos Whatsapp e Typebot """
		whatsapp_client = WuzAPI(request, request_data, db)
		
		""" 
		Resource = whatsapp
		Inicia o processo TypeBot - Mensagens de entrada
		
		Resource = chatwoot
		Apenas repassa ao whatsapp
		"""
		"""
			TODO
			- Verificar o status da conversa
		"""
		# if whatsapp_client.data["event_type"] == "Message":
		if whatsapp_client.resource == "whatsapp":
			typebot_client = TypeBot(whatsapp_client, db)
			try:
				await typebot_client.run()
			except Exception as e:
				await db.rollback()
				raise e
		elif whatsapp_client.resource == "chatwoot":
			await whatsapp_client.sender([])
	except Exception as e:
		print(e)
		raise e
	return {"code": 200}