import os
import redis
import json
import re
import requests
import io
import httpx
import logging
import magic

from pprint import pprint

from typing import Annotated, Any
from typing_extensions import TypedDict

from google import genai
from google.genai import types

from fastapi import APIRouter, Body, Depends, Path, Request, Security, status
from fastapi_versioning import version

from app.schemas.chatbot.conversation import FreeConversationBase, ReadDocumentsBase

from app.utils.gemini_tools.tools import schedule_meeting_function, schedule_meeting
from app.utils.prompts import DEFAULT_PERSONA, DEFAULT_MEMORY
from app.utils.db import get_session
from app.utils.auth import scopes


router = APIRouter()
logger = logging.getLogger("UtilsAPI")

def _redis_client() -> redis.Redis:
	return redis.Redis(host=os.environ.get("REDIS_HOST"), port=6379, db=4, socket_timeout=10)

def _gemini_new_client() -> genai.Client:
	return genai.Client(api_key=os.environ.get("GOOGLE_GEMINI_API_KEY"))

def _load_memory(chat_id: str) -> str:
	chat = ""
	redis = _redis_client()
	messages = redis.lrange(chat_id, 0, -1)
	if len(messages) > 50:
		messages = messages[-50:]
	for message_json in messages:
		message = json.loads(message_json)
		role = message["role"]
		text = message["text"]
		chat += f"role: {role}\n"
		chat += f"text: {text}\n"
	return chat

def _save_memory(chat: Any, chat_id: str, role: str) -> None:
	redis = _redis_client()
	redis_messages = redis.lrange(chat_id, 0, -1)
	messages = []
	if role == "agent":
		data = {
			"role": role,
			"text": chat.text,
		}
	if role == "human":
		data = {
			"role": role,
			"text": chat,
		}
	messages.append(json.dumps(data))
	redis.rpush(chat_id, *messages)

def _get_system_instructions(config: dict, prompts: list) -> str:
	config = {
		"USER_NAME": config.get("user_name", ""),
		"MEMORY": config.get("memory", ""),
	}
	for i, prompt in enumerate(prompts):
		vars_to_replace = re.findall(r"{{(.*?)}}", prompt)
		for var in vars_to_replace:
			prompt = prompt.replace(f"{{{{{var}}}}}", config[var])
		prompts[i] = prompt
	return prompts


class FreeConversationResponse(TypedDict):
	Status: str
	Response: str

class CustomResponseGemini:
	def __init__(self, text):
		self.text = text

@router.post(
	"/",
	status_code=status.HTTP_200_OK,
	response_model=FreeConversationResponse,
)
@version(1, 0)
async def free_conversation(
	token: Annotated[None, Security(scopes, scopes=["owner"])],
	payload: Annotated[FreeConversationBase, Body(title="Envie mensagem para conversar com a IA.")],
	db = Depends(get_session),
) -> FreeConversationResponse:
	"""
	Conversação livre com a IA
	"""
	chat_id = payload.chat_id
	user_name = payload.user_name
	question = payload.question
	gemini_client = _gemini_new_client()

	memory = _load_memory(chat_id)
	_save_memory(question, chat_id, "human")
	config = {
		"memory": memory,
		"user_name": user_name,
	}
	tools = types.Tool(function_declarations=[schedule_meeting_function])
	system_prompts = [DEFAULT_PERSONA, DEFAULT_MEMORY]
	system_instructions = _get_system_instructions(config, system_prompts)
	generation_config = {
		"temperature": 0.7,
		"top_p": 1,
		# "top_k": 1,
		# "max_output_tokens": 4096,
		"system_instruction": system_instructions,
		"tools": [tools],
	}

	response = gemini_client.models.generate_content(
		model="gemini-2.5-flash",
		contents=question,
		config=types.GenerateContentConfig(**generation_config),
	)

	if response.candidates[0].content.parts[0].function_call:
		function_call = response.candidates[0].content.parts[0].function_call
		print(f"Function to call: {function_call.name}")
		print(f"Arguments: {function_call.args}")
		if function_call.name == "schedule_meeting":
			if schedule_meeting(**function_call.args):
				response = CustomResponseGemini("Sua reunião foi agendada com sucesso!")
			else:
				response = CustomResponseGemini("Houve algum problema com o Google Calender, favor envie os dados novamente.")

	pprint(response)
	_save_memory(response, chat_id, "agent")
	return FreeConversationResponse(**{"Status": "Success", "Response": response.text})


@router.post(
	"/documents/read/",
	status_code=status.HTTP_200_OK,
	response_model=None,
)
@version(1, 0)
async def read_documents(
	token: Annotated[None, Security(scopes, scopes=["owner"])],
	payload: Annotated[ReadDocumentsBase, Body(title="Envie mensagem para conversar com a IA.")],
	db = Depends(get_session),
):
	chat_id = payload.chat_id
	user_name = payload.user_name
	url_document = payload.url_document
	type_document = payload.type_document
	question = payload.question
	gemini_client = _gemini_new_client()

	if type_document == "imageMessage":

		allowed_formats = [
			"image/png", "image/jpeg", "image/webp", "image/heic", "image/heif"
		]
		get_response = requests.get(url_document)
		image_bytes = get_response.content
		content_type = magic.from_buffer(image_bytes, mime=True)

		if content_type not in allowed_formats:
			return {"Status": "Image not allowed", "Response": "Desculpe, não consigo visualizar esse tipo de formato."}
		
		image = types.Part.from_bytes(data=image_bytes, mime_type=content_type)

		response = gemini_client.models.generate_content(
			model="gemini-2.5-flash",
			contents=[question if question else "Fale sobre esta imagem.", image],
		)

	if type_document == "documentMessage":

		allowed_formats = [
			"application/pdf", "application/x-javascript", "text/javascript",
			"application/x-python", "text/x-python", "text/plain", "text/html",
			"text/css", "text/md", "text/csv", "text/xml", "text/rtf"
		]

		get_response = httpx.get(url_document)
		content_type = get_response.headers.get("Content-Type")

		if content_type not in allowed_formats:
			return {"Status": "Document not allowed", "Response": "Desculpe, não consigo visualizar esse tipo de formato."}

		doc_io = io.BytesIO(get_response.content)
		sample_doc = gemini_client.files.upload(
			file=doc_io,
			config={
				"mime_type": content_type
			}
		)

		response = gemini_client.models.generate_content(
			model="gemini-2.5-flash",
			contents=[sample_doc, question if question else "Fale sobre este documento."]
		)

	return {"Status": "Success", "Response": response.text}


@router.post(
	"/clear/{chat_id}/",
	status_code=status.HTTP_200_OK,
)
@version(1, 0)
async def clear_conversation(
	token: Annotated[None, Security(scopes, scopes=["owner"])],
	chat_id: Annotated[str, Path(title="ID do chat a ser limpo.")],
	request: Request,
	db = Depends(get_session),
):
	redis = _redis_client()
	redis.delete(chat_id)
	return {"Status": "Success"}