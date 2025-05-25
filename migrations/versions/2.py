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
		CREATE TABLE IF NOT EXISTS users_permissions (
			id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
			user_id CHAR(36),
			permission VARCHAR(150) NOT NULL,
			disable BOOLEAN DEFAULT FALSE,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(id)
		);
	""")
	
	await db.insert(f"""
		INSERT INTO users_permissions (user_id, permission, disable)
		VALUES
		((SELECT id FROM users WHERE user_name = 'admin'), '["owner"]', 0)
	""")

async def down():
	await db.query("DROP TABLE users_permissions;")