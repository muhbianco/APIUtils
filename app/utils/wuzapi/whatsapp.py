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
	async def sender(messages):
		pass