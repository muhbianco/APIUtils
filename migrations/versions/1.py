import sys
import os
from dotenv import load_dotenv
load_dotenv()

from passlib.context import CryptContext

projeto_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(projeto_dir)

from app.utils.db import DB

db = DB()

async def up():
	await db.query("""
		CREATE TABLE IF NOT EXISTS users (
			id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
			user_name VARCHAR(50) NOT NULL,
			full_name VARCHAR(100) NOT NULL,
			email VARCHAR(100) NOT NULL UNIQUE,
			pass VARCHAR(255) NOT NULL,
			disable BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		);
	""")
	try:
		pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
		plain_password = os.environ["ADMIN_API_PASS"]
		hashed_password = pwd_context.hash(plain_password)
	except:
		pass
	await db.insert(f"""
		INSERT INTO users (user_name, full_name, email, pass, disable)
		VALUES
		('admin', 'Admin', 'muhbianco@gmail.com', '{hashed_password}', 0)
	""")

async def down():
	await db.query("DROP TABLE users;")