import os
import urllib.parse
import aiohttp
import requests
import base64

from pprint import pprint
	
from app.utils.s3.minio import S3Minio
from app.errors.http_errors import CustomHTTPException


def wuzapi_end_points():
	return {
		"imageMessage": "chat/downloadimage",
		"documentMessage": "chat/downloaddocument",
		"sendText": "chat/send/text",
		"audioMessage": "chat/downloadvideo",
		"sendImage": "chat/send/image"
	}

class WuzAPI:
	def __init__(self, request, in_data, db):
		self.db = db
		self.data = {}
		self.resource = request.query_params.get("resource")

		""" Mensagens vinda do whatsapp (wuzapi)"""
		if self.resource == "whatsapp":
			in_data["jid"] = request.query_params.get("jid", None)
			in_data["typebot_public_id"] = request.query_params.get("typebot_public_id", None)

			if not in_data["jid"]:
				raise CustomHTTPException.missing_jid()
			# if not in_data["typebot_public_id"]:
			# 	raise CustomHTTPException.missing_typebot_public_id()
			
			self.data = {
				"typebot_public_id": in_data["typebot_public_id"],
				"event_type": in_data["type"],
				"from_me": in_data["event"]["Info"]["IsFromMe"],
				"receiver": in_data["jid"],
				"sender": {
					"name": in_data["event"]["Info"]["PushName"],
					"number": "",
				},
				"message": {
					"type": in_data["event"]["Info"]["Type"],
					"message": "",
				}
			}

			""" Se a mensagem for do hoster/bot ignora """
			if self.data["from_me"]:
				raise CustomHTTPException.message_from_bot()

			if ":" in in_data["event"]["Info"]["Sender"]:
				self.data["sender"]["number"] = in_data["event"]["Info"]["Sender"].split(":")[0]
			else:
				self.data["sender"]["number"] = in_data["event"]["Info"]["Sender"].split("@")[0]
			self.type = None

			if "conversation" in in_data["event"]["Message"]:
				self.data["message"]["message"] = in_data["event"]["Message"]["conversation"]
				self.type = "conversation"

			self.allowed_types = ["imageMessage", "documentMessage", "audioMessage"]
			if any(key in in_data["event"]["Message"] for key in self.allowed_types):
				for key in self.allowed_types:
					if key in in_data["event"]["Message"]:
						self.type = key
						break

				url = in_data['event']['Message'][self.type]['URL']
				caption = ""
				if "caption" in in_data['event']['Message'][self.type]:
					caption = in_data['event']['Message'][self.type]['caption']
				mimetype = in_data["event"]["Message"][self.type]["mimetype"]
				self.data["message"]["message"] = f"imageMessage|{url}|{caption}"
				self.data["message"]["mimetype"] = mimetype
				self.data["message"]["caption"] = caption
				self.data["message"]["url"] = url
				self.data["message"]["mediaKey"] = in_data['event']['Message'][self.type]['mediaKey']
				self.data["message"]["filename"] = in_data["fileName"]
				self.data["message"]["directPath"] = in_data['event']['Message'][self.type]['directPath']
				self.data["message"]["fileEncSHA256"] = in_data['event']['Message'][self.type]['fileEncSHA256']
				self.data["message"]["fileSHA256"] = in_data['event']['Message'][self.type]['fileSHA256']
				self.data["message"]["fileLength"] = in_data['event']['Message'][self.type]['fileLength']
		
		elif self.resource == "chatwoot":
			allowed_events = ["message_created", "conversation_updated", "message_updated"]
			self.data["event_type"] = in_data.get("event")
			
			if self.data["event_type"] in allowed_events:
				if in_data.get("meta"):
					receiver = in_data.get("meta").get("assignee").get("available_name")
					sender_name = in_data.get("meta").get("sender").get("name")
					sender_number = in_data.get("meta").get("sender").get("identifier")
					message_type = in_data.get("messages")[0].get("content_type")
					message = in_data.get("messages")[0].get("content")
				else:
					receiver = in_data.get("conversation").get("meta").get("assignee").get("available_name")
					sender_name = in_data.get("conversation").get("meta").get("sender").get("name")
					sender_number = in_data.get("conversation").get("meta").get("sender").get("identifier")
					message_type = in_data.get("conversation").get("messages")[0].get("content_type")
					message = in_data.get("conversation").get("messages")[0].get("content")
				self.data = {
					"from_me": True,
					"receiver": receiver,
					"sender": {
						"name": sender_name,
						"number": sender_number.split("@")[0],
					},
					"message": {
						"type": message_type,
						"message": message,
					}
				}
		else:
			print("mensagens vindas de lugar desconhecido.")

	async def gen_s3_url_file(self):
		if self.type not in self.allowed_types:
			return

		whatsapp_url_base = os.environ.get("WUZAPI_URL")
		whatsapp_endpoint = wuzapi_end_points()[self.type]
		whatsapp_url = urllib.parse.urljoin(whatsapp_url_base, whatsapp_endpoint)
		whatsapp_headers = {
			"content-type": "application/json",
			"accept": "application/json",
			"token": f"{os.environ.get('WUZAPI_TOKEN')}",
		}
		whatsapp_payload = {
			"Url": self.data["message"]["url"],
			"DirectPath": self.data["message"]["directPath"],
			"MediaKey": self.data["message"]["mediaKey"],
			"Mimetype": self.data["message"]["mimetype"],
			"FileEncSHA256": self.data["message"]["fileEncSHA256"],
			"FileSHA256": self.data["message"]["fileSHA256"],
			"FileLength": self.data["message"]["fileLength"],
		}
		async with aiohttp.ClientSession() as session:
			async with session.post(whatsapp_url, headers=whatsapp_headers, json=whatsapp_payload) as whatsapp_request:
				whatsapp_response = await whatsapp_request.json()
				if whatsapp_request.status != 200:
					raise CustomHTTPException.whatsapp_sender_error(whatsapp_response)

		s3_url = await S3Minio.upload_file(whatsapp_response, self.data["message"]["filename"])
		self.data["message"]["message"] = f"{self.type}|{s3_url}"
		if self.data['message']['caption']:
			self.data["message"]["message"] += f"|{self.data['message']['caption']}"

	async def url_to_base64(self, image_url):
	    response = requests.get(image_url)
	    response.raise_for_status()

	    mime_type = response.headers.get("Content-Type")
	    base64_bytes = base64.b64encode(response.content)
	    base64_string = base64_bytes.decode("utf-8")

	    return f"data:{mime_type};base64,{base64_string}"


	async def sender(self, messages):
		whatsapp_url_base = os.environ.get("WUZAPI_URL")
		whatsapp_headers = {
			"content-type": "application/json",
			"accept": "application/json",
			"token": f"{os.environ.get('WUZAPI_TOKEN')}",
		}
		whatsapp_payload = {
			"Phone": self.data["sender"]["number"],
		}
		if self.resource == "chatwoot":
			messages = [f"*[{self.data['receiver']}]*\n"+self.data["message"]["message"]]
		for message in messages:
			if "imageMessage|" in message:
				whatsapp_endpoint = wuzapi_end_points()["sendImage"]
				whatsapp_payload["Image"] = await self.url_to_base64(message.split("|")[1])
				whatsapp_payload["Caption"] = message.split("|")[1]
			else:
				whatsapp_endpoint = wuzapi_end_points()["sendText"]
				whatsapp_payload["Body"] = message
			whatsapp_url = urllib.parse.urljoin(whatsapp_url_base, whatsapp_endpoint)
			async with aiohttp.ClientSession() as session:
				async with session.post(whatsapp_url, headers=whatsapp_headers, json=whatsapp_payload) as whatsapp_request:
					whatsapp_response = await whatsapp_request.json()
					if whatsapp_request.status != 200:
						raise CustomHTTPException.whatsapp_sender_error(whatsapp_response)