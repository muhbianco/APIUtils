import os
import redis
import json

from typing import Annotated, List
from typing_extensions import TypedDict
from pprint import pprint, pformat

from google import genai
from google.genai import types
from google.genai.types import GenerateContentResponse, Candidate, Content, Part

from fastapi import APIRouter, Body, Depends, HTTPException, Path, Query, Request, Security, status
from fastapi.responses import JSONResponse
from fastapi_versioning import version

from app.schemas.chatbot.conversation import FreeConversationBase

from app.utils.prompts import DEFAULT_PERSONA, DEFAULT_MEMORY
from app.utils.db import get_session
from app.utils.auth import scopes

from redis.exceptions import TimeoutError as RedisTimeoutError

router = APIRouter()

def _redis_client() -> redis.Redis:
    return redis.Redis(host=os.environ.get("REDIS_HOST"), port=6379, db=4, socket_timeout=10)

def _gemini_new_client() -> genai.Client:
    return genai.Client(api_key=os.environ.get("GOOGLE_GEMINI_API_KEY"))

def _load_memory(chat_id: str) -> genai.Client.chats:
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
        chat += f"text: {text}\n\n"
    return chat

def _save_memory(chat: genai.Client.chats, chat_id: str) -> None:
    redis = _redis_client()
    redis_messages = redis.lrange(chat_id, 0, -1)
    messages = []
    for message in chat._comprehensive_history:
        role = message.role
        for part in message.parts:
            data = {
                "role": role,
                "text": part.text,
            }
            messages.append(json.dumps(data))
    redis.rpush(chat_id, *messages)


@router.post(
    "/",
    status_code=status.HTTP_200_OK,
)
@version(1, 0)
async def free_conversation(
    token: Annotated[None, Security(scopes, scopes=["owner"])],
    payload: Annotated[FreeConversationBase, Body(title="Envie mensagem para conversar com a IA.")],
    db = Depends(get_session),
):
    """
    Conversação livre com a IA
    """
    chat_id = payload.chat_id
    question = payload.question
    conversation_gemini_client = _gemini_new_client()

    memory = _load_memory(chat_id)
    generation_config = {
        "temperature": 0.7,
        "top_p": 1,
        # "top_k": 1,
        # "max_output_tokens": 4096,
        "system_instruction": DEFAULT_PERSONA+DEFAULT_MEMORY.replace("{{MEMORY}}", memory)
    }

    conversation_chat = conversation_gemini_client.chats.create(
        model="gemini-2.5-flash",
        config=types.GenerateContentConfig(**generation_config)
    )

    response = conversation_chat.send_message(question)
    _save_memory(conversation_chat, chat_id)
    
    return {"Status": "Success", "Response": response.text}
