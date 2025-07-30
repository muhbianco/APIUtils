import os
import urllib.parse
import aiohttp

from pprint import pprint

from app.routers.chatbot.conversation import gemini_free_conversation
from app.errors.http_errors import CustomHTTPException

def extract_text_from_richtext(node, type, type_nodes = []):
	texts = []
	parts = ""
	type_nodes.append(type)
	li = False
	lic = False

	for item in node:

		if "text" in item:

			last_node = False
			if len(type_nodes) >= 2:
				last_node = type_nodes[-2]

			if not item["text"]:
				if type == "hr":
					item["text"] = "____________________________________"
				if type == "p":
					item["text"] = "\n"
			else:
				if item.get("bold"):
					item["text"] = f"*{item['text']}*"
				if item.get("italic"):
					item["text"] = f"_{item['text']}_"
				if item.get("code"):
					item["text"] = f"`{item['text']}`"

				if (type == "li" or last_node == "li") and not li:
					item["text"] = f"• {item['text']}"
					li = True
				elif (type == "li" or last_node == "li") and li:
					item["text"] = f"{item['text']}"

				if (type == "lic" or last_node == "lic") and not lic:
					item["text"] = f"	{item['text']}"
					lic = True
				elif (type == "lic" or last_node == "lic") and lic:
					item["text"] = f"{item['text']}"

				if type == "h1":
					item["text"] = f"***{item['text']}***"

				if type == "code_line":
					item["text"] = f"```{item['text']}```"
				

			parts += item["text"]

		if "children" in item:
			texts.extend(extract_text_from_richtext(item["children"], item["type"], type_nodes))

	if parts:
		texts.append(parts+"\n")
	return texts


class tools:
	@staticmethod
	async def messages_normalizer(typebot_response):
		response = []
		for bubble in typebot_response:
			typebot_data = typebot_response[bubble]
			if bubble == "messages":
				for message in typebot_data:
					type = message["content"]["type"]
					content = ""
					for child in message["content"][type]:
						content += "".join(extract_text_from_richtext(child["children"], child["type"]))
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
	def __init__(self, whatsapp_client, db):
		self.db = db
		self.whatsapp_client = whatsapp_client
		self.typebot_session_id = None
		self.typebot_public_id = whatsapp_client.data["typebot_public_id"]
		self.sender_number = whatsapp_client.data["sender"]["number"]
		self.sender_name = whatsapp_client.data["sender"]["name"]
		self.message = whatsapp_client.data["message"]["message"]
		self.whatsapp_event_type = whatsapp_client.data["event_type"]

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
		self.typebot_session_id = response["session_id"] if response else None

	async def save_session(self):
		values = (self.typebot_session_id, self.typebot_public_id, self.sender_number, "open", )
		query = """
			INSERT INTO typebot_sessions
			(session_id, typebot_public_id, remote_jid, status) VALUES
			(%s, %s, %s, %s)
		"""
		await self.db.insert(query, values)

	async def run(self):
		await self.get_active_session()
		if not self.typebot_session_id:
			await self.whatsapp_client.gen_s3_url_file()
			self.message = self.whatsapp_client.data["message"]["message"]
			if self.typebot_public_id:
				typebot_response = await self.start_chat()
				messages_to_send = await tools.messages_normalizer(typebot_response)
				await self.whatsapp_client.sender(messages_to_send)
			else:
				await gemini_free_conversation(
					self.sender_number, self.sender_name,
					self.message, self.whatsapp_client
				)
			# await self.save_session()
			# await self.db.commit()