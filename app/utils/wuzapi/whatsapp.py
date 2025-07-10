import os
import aiohttp
import urllib.parse
import base64
import io

from pprint import pprint
from minio import Minio

from app.errors.http_errors import CustomHTTPException

def minio_client():
	access_key = os.environ.get("MINIO_ACCESS_KEY")
	secret_key = os.environ.get("MINIO_SECRET_KEY")
	minio_url = os.environ.get("MINIO_URL")
	return Minio(minio_url, access_key=access_key, secret_key=secret_key, secure=True)

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
			}
		}
		if "conversation" in in_data["event"]["Message"]:
			self.data["message"]["message"] = in_data["event"]["Message"]["conversation"]
			self.type = "conversation"

		if "imageMessage" in in_data["event"]["Message"]:
			url = in_data['event']['Message']['imageMessage']['URL']
			caption = ""
			if "caption" in in_data['event']['Message']['imageMessage']:
				caption = in_data['event']['Message']['imageMessage']['caption']
			mimetype = in_data["event"]["Message"]["imageMessage"]["mimetype"]
			self.data["message"]["message"] = f"imageMessage|{url}|{caption}"
			self.data["message"]["mimetype"] = mimetype
			self.data["message"]["caption"] = caption
			self.data["message"]["url"] = url
			self.data["message"]["mediaKey"] = in_data['event']['Message']['imageMessage']['mediaKey']
			self.data["message"]["filename"] = in_data["fileName"]
			self.data["message"]["directPath"] = in_data['event']['Message']['imageMessage']['directPath']
			self.data["message"]["fileEncSHA256"] = in_data['event']['Message']['imageMessage']['fileEncSHA256']
			self.data["message"]["fileSHA256"] = in_data['event']['Message']['imageMessage']['fileSHA256']
			self.data["message"]["fileLength"] = in_data['event']['Message']['imageMessage']['fileLength']
			self.type = "imageMessage"


	async def gen_s3_url_file(self):
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

		base64_str = whatsapp_response["data"]["Data"].split(",")[1]
		decoded_bytes = base64.b64decode(base64_str)
		content_length = len(decoded_bytes)
		file_bytes = io.BytesIO(decoded_bytes)
		file_bytes.seek(0)
		minio = minio_client()
		result = minio.put_object(
			"whatsapp",
			self.data["message"]["filename"],
			file_bytes,
			content_length,
			content_type=self.data["message"]["mimetype"],
		)
		minio_file_name = result._object_name
		url = f"https://storage.muhbianco.com.br/api/v1/buckets/whatsapp/objects/download?preview=true&prefix={minio_file_name}&version_id=null"
		self.data["message"]["message"] = f"{self.type}|{url}"
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