import os
import urllib.parse
import aiohttp

from pprint import pprint
	
from app.utils.s3.minio import S3Minio
from app.errors.http_errors import CustomHTTPException


def wuzapi_end_points():
	return {
		"imageMessage": "chat/downloadimage",
		"documentMessage": "chat/downloaddocument",
		"sendText": "chat/send/text",
	}

class WuzAPI:
	def __init__(self, in_data, db):
		self.db = db

		self.data = {
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
				"message": "",
			}
		}
		self.type = None

		if "conversation" in in_data["event"]["Message"]:
			self.data["message"]["message"] = in_data["event"]["Message"]["conversation"]
			self.type = "conversation"

		allowed_types = ["imageMessage", "documentMessage"]
		print("allowed_types", allowed_types)
		print(any(key in in_data["event"]["Message"] for key in allowed_types))
		if any(key in in_data["event"]["Message"] for key in allowed_types):
			for key in allowed_types:
				if key in in_data["event"]["Message"]:
					self.type = key
					break

			print(f"??????????????????????? {self.type}")
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


	async def gen_s3_url_file(self):
		if self.type not in ["imageMessage", "documentMessage"]:
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


	async def sender(self, messages):
		whatsapp_url_base = os.environ.get("WUZAPI_URL")
		whatsapp_endpoint = wuzapi_end_points()["sendText"]
		whatsapp_url = urllib.parse.urljoin(whatsapp_url_base, whatsapp_endpoint)
		whatsapp_headers = {
			"content-type": "application/json",
			"accept": "application/json",
			"token": f"{os.environ.get('WUZAPI_TOKEN')}",
		}
		whatsapp_payload = {
			"Phone": self.data["sender"]["number"],
		}
		for message in messages:
			whatsapp_payload["Body"] = message
			async with aiohttp.ClientSession() as session:
				async with session.post(whatsapp_url, headers=whatsapp_headers, json=whatsapp_payload) as whatsapp_request:
					whatsapp_response = await whatsapp_request.json()
					if whatsapp_request.status != 200:
						raise CustomHTTPException.whatsapp_sender_error(whatsapp_response)