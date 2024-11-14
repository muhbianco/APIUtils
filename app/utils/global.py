import os

kommo_base_url = os.environ["KOMMO-URL"]
kommo_access_token = os.environ["KOMMO-TOKEN"]
headers = {
    "authorization": f"Bearer {kommo_access_token}",
    "accept": "application/json",
}