import os
import urllib.parse
import requests
import aiohttp

from pprint import pprint

class sessions:
	@staticmethod
	async def get_active_session(data, db):
		values = (data["typebot_public_id"], data["sender"]["number"], )
		query = """
			SELECT 1 FROM typebot_sessions
			WHERE typebot_public_id = %s
			AND remote_jid = %s;
		"""
		response = await db.fetchone(query, values)
		return response
		
	@staticmethod
	async def startChat(data, db):
		typebot_url_base = os.environ.get("TYPEBOT_URL")
		typebot_url = urllib.parse.urljoin(typebot_url_base, f"api/v1/typebots/{data['typebot_public_id']}/startChat")
		typebot_headers = {
			"content-type": "application/json",
			"accept": "application/json",
		}
		typebot_payload = {
			"message": "",
			"prefilledVariables": {
				"remoteJid": data["sender"]["number"],
				"pushName": data["sender"]["name"],
			}
		}
		async with aiohttp.ClientSession() as session:
			async with session.post(typebot_url, headers=typebot_headers, json=typebot_payload) as typebot_request:
				typebot_response = await typebot_request.json()
		return typebot_response


class tools:
	@staticmethod
	async def messages_normalizer(messages):
		pprint(messages)