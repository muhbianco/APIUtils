import os
import requests

from pprint import pprint
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo


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
