import sys
import os

projeto_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(projeto_dir)

from app.utils.db import DB

db = DB()

async def up():
	pass

async def down():
	pass