import os
import aiohttp
import urllib.parse

from pprint import pprint

from app.errors.http_errors import CustomHTTPException


class tools:
	@staticmethod
	async def incoming_normalizer(in_data):
		data = {
			"typebot_public_id": in_data["typebot_public_id"],
			"event_type": in_data["type"],
			"from_me": in_data["event"]["Info"]["IsFromMe"],
			"receiver": in_data["jid"],
			"sender": {
				"name": in_data["event"]["Info"]["PushName"],
				"number": in_data["event"]["Info"]["Sender"].split(":")[0],
			},
			"message": {
				"type": in_data["event"]["Info"]["Type"],
				"message": in_data["event"]["Message"]["conversation"],
			}
		}
		return data

	@staticmethod
	async def sender(messages, data):
		whatsapp_url_base = os.environ.get("WUZAPI_URL")
		whatsapp_url = urllib.parse.urljoin(whatsapp_url_base, f"chat/send/text")
		whatsapp_headers = {
			"content-type": "application/json",
			"accept": "application/json",
			"token": f"{os.environ.get('WUZAPI_TOKEN')}",
		}
		whatsapp_payload = {
			"Phone": data["sender"]["number"],
		}
		for message in messages:
			whatsapp_payload["Body"] = message
			async with aiohttp.ClientSession() as session:
				async with session.post(whatsapp_url, headers=whatsapp_headers, json=whatsapp_payload) as whatsapp_request:
					whatsapp_response = await whatsapp_request.json()
					if whatsapp_request.status != 200:
						raise CustomHTTPException.whatsapp_sender_error(whatsapp_response)
