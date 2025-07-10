import os
import urllib.parse
import aiohttp

from pprint import pprint

from app.errors.http_errors import CustomHTTPException

def extract_text_from_richtext(node, type_nodes, type=None):
	texts = []
	type_nodes.append(type)

	if isinstance(node, dict):
		if 'text' in node:

			last_node = False
			if len(type_nodes) >= 2:
				last_node = type_nodes[-2]
			
			if "bold" in node and node["bold"]:
				node['text'] = f"*{node['text']}*"
			if "italic" in node and node["italic"]:
				node['text'] = f"_{node['text']}_"
			if "code" in node and node["code"]:
				node['text'] = f"~{node['text']}~"

			if last_node and last_node == "li":
				node['text'] = f"- {node['text']}"
			if type == "lic":
				node['text'] = f"	{node['text']}"

			texts.append(node['text']+"\n")

		if 'children' in node:
			for child in node['children']:
				texts.extend(extract_text_from_richtext(child, type_nodes, node['type']))
	elif isinstance(node, list):
		for item in node:
			texts.extend(extract_text_from_richtext(item, type_nodes, type))

	return texts

class tools:

	@staticmethod
	async def messages_normalizer(typebot_response):
		response = []
		for bubble in typebot_response:
			typebot_data = typebot_response[bubble]
			if bubble == "messages":
				for message in typebot_data:
					content = ""
					type = message["content"]["type"]
					content = " ".join(extract_text_from_richtext(message["content"][type], []))
					response.append(content)
			if bubble == "input":
				content = ""
				if "options" in typebot_data:
					content = typebot_data["options"]["labels"]["placeholder"]
					if content:
						response.append(content)
				else:
					raise CustomHTTPException.missing_typebot_placeholder()
		return response


class TypeBot:
	def __init__(self, data, db):
		self.db = db

		self.typebot_session_id = None
		self.typebot_public_id = data["typebot_public_id"]
		self.sender_number = data["sender"]["number"]
		self.sender_name = data["sender"]["name"]
		self.message = data["message"]["message"]

	async def start_chat(self):
		typebot_url_base = os.environ.get("TYPEBOT_URL")
		typebot_url = urllib.parse.urljoin(typebot_url_base, f"api/v1/typebots/{self.typebot_public_id}/startChat")
		typebot_headers = {
			"content-type": "application/json",
			"accept": "application/json",
		}
		typebot_payload = {
			"message": self.message,
			"prefilledVariables": {
				"remoteJid": self.sender_number,
				"pushName": self.sender_name,
			}
		}
		async with aiohttp.ClientSession() as session:
			async with session.post(typebot_url, headers=typebot_headers, json=typebot_payload) as typebot_request:
				typebot_response = await typebot_request.json()
		self.typebot_session_id = typebot_response["sessionId"]
		return typebot_response

	async def get_active_session(self):
		values = (self.typebot_public_id, self.sender_number, )
		query = """
			SELECT session_id FROM typebot_sessions
			WHERE typebot_public_id = %s
			AND remote_jid = %s
			AND status IN('open', 'paused');
		"""
		response = await self.db.fetchone(query, values)
		return response["session_id"] if response else None

	async def save_session(self):
		values = (self.typebot_session_id, self.typebot_public_id, self.sender_number, "open", )
		query = """
			INSERT INTO typebot_sessions
			(session_id, typebot_public_id, remote_jid, status) VALUES
			(%s, %s, %s, %s)
		"""
		await self.db.insert(query, values)
