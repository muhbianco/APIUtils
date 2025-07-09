import sys
import os
from dotenv import load_dotenv
load_dotenv()

projeto_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
sys.path.append(projeto_dir)

async def up(db):
	await db.query("""
		CREATE TABLE IF NOT EXISTS typebot_sessions (
			session_id VARCHAR(36) PRIMARY KEY NOT NULL,
			typebot_public_id VARCHAR(36),
			remote_jid VARCHAR(15) NOT NULL,
			status ENUM('open', 'paused', 'closed') DEFAULT 'open' NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
		);
	""")

async def down(db):
	await db.query("DROP TABLE typebot_sessions;")