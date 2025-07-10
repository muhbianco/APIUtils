import os
import aiohttp
import urllib.parse
import base64
import io

from pprint import pprint
from minio import Minio

def minio_client():
	access_key = os.environ.get("MINIO_ACCESS_KEY")
	secret_key = os.environ.get("MINIO_SECRET_KEY")
	minio_url = os.environ.get("MINIO_URL")
	return Minio(minio_url, access_key=access_key, secret_key=secret_key, secure=True)

class S3Minio:
	@staticmethod
	async def upload_file(whatsapp_response, filename):
		mimetype = whatsapp_response["data"]["Mimetype"]
		base64_str = whatsapp_response["data"]["Data"].split(",")[1]
		decoded_bytes = base64.b64decode(base64_str)
		content_length = len(decoded_bytes)
		file_bytes = io.BytesIO(decoded_bytes)
		file_bytes.seek(0)
		minio = minio_client()
		result = minio.put_object(
			"whatsapp",
			filename,
			file_bytes,
			content_length,
			content_type=mimetype,
		)
		minio_file_name = result._object_name
		return f"https://storage.muhbianco.com.br/api/v1/buckets/whatsapp/objects/download?preview=true&prefix={minio_file_name}&version_id=null"