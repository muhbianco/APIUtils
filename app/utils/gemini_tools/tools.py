import os
import requests
import base64
import uuid

from pprint import pprint
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO

from app.utils.s3.minio import S3Minio


def _gemini_new_client() -> genai.Client:
	return genai.Client(api_key=os.environ.get("GOOGLE_GEMINI_API_KEY"))


schedule_meeting_function = {
	"name": "schedule_meeting",
	"description": "Agenda um evento no calendário do google com uma lista de emails, data e hora.",
	"parameters": {
		"type": "object",
		"properties": {
			"attendees": {
				"type": "array",
				"items": {"type": "string"},
				"description": "Lista de emails das pessoas que vão participar da agenda.",
			},
			"date": {
				"type": "string",
				"description": "Data da agenda (e.g., '2024-07-29')",
			},
			"time": {
				"type": "string",
				"description": "Hora da agenda (e.g., '15:00')",
			},
			"topic": {
				"type": "string",
				"description": "O titulo com o assunto do evento da agenda.",
			},
		},
		"required": ["attendees", "date", "time", "topic"],
	},
}
create_image_function = {
	"name": "image_creation",
	"description": """Sempre que o usuário solicitar uma imagem, ilustração, desenho, cena visual, gráfico ou qualquer tipo de representação visual, use esta função para criar a imagem com base na descrição textual fornecida.
Essa ferramenta deve ser usada imediatamente, sem pedir confirmação, sempre que uma imagem for solicitada ou implícita.""",
	"parameters": {
		"type": "object",
		"properties": {
			"request": {
				"type": "string",
				"description": "Descrição detalhada da imagem a ser criada conforme solicitado pelo usuário.",
			}
		},
		"required": ["request"],
	},
}

def schedule_meeting(**args):
	url = os.environ.get("N8N_URL_WEBHOOK")
	date = args.get("date")
	time = args.get("time")
	dt = datetime.fromisoformat(f"{date}T{time}")
	dt_sp = dt.replace(tzinfo=ZoneInfo("America/Sao_Paulo"))
	dt_end_sp = dt_sp+timedelta(hours=1)
	date_formatted = dt_sp.isoformat()
	date_end_formatted = dt_end_sp.isoformat()
	headers = {
		"accept": "application/json",
		"content-type": "application/json",
		"authorization": os.environ.get("N8N_AUTHORIZATION")
	}
	event = {
		'summary': args.get("topic"),
		'location': None,
		'description': args.get("topic"),
		'start': {
			'dateTime': date_formatted,
			'timeZone': 'America/Sao_Paulo',
		},
		'end': {
			'dateTime': date_end_formatted,
			'timeZone': 'America/Sao_Paulo',
		},
		'attendees': [{"email": email} for email in args.get("attendees")],
		'reminders': {
			'useDefault': False,
			'overrides': [
				{'method': 'email', 'minutes': 24 * 60},
				{'method': 'popup', 'minutes': 10},
			],
		},
	}

	response = requests.post(url+"9df0ce85-e95e-4554-9566-038e1791ee97", headers=headers, json=event)
	if response.status_code == 200:
		return True
	return False

async def create_image(**args):
	client = _gemini_new_client()

	response = client.models.generate_images(
	    model="imagen-4.0-ultra-generate-preview-06-06",
	    prompt=args.get("request"),
	    config=types.GenerateImagesConfig(
	        number_of_images=1,
	    )
	)

	image_data = {
		"data": {
			"Mimetype": response.generated_images[0].image.mime_type,
			"Data": base64.b64encode(response.generated_images[0].image.image_bytes).decode('utf-8'),
		}
	}
	s3_url = await S3Minio.upload_file(image_data, f"{uuid.uuid4()}.{image_data['data']['Mimetype'].split('/')[1]}")
	print("criando url", s3_url)
	return s3_url