import os
import sys
import importlib.util
import asyncio
import asyncmy
import pprint
import logging

projeto_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
sys.path.append(projeto_dir)

from app.utils.db import DB

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("app.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("SmartyUtilsAPI - Migrations")
db = DB()

class init_db:
    async def create(self):
        logger.info("Verificando e criando tabela schema_info, se necessário")
        await db.query("""
            CREATE TABLE IF NOT EXISTS schema_info (
                id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
                version TINYINT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        """)
        result = await db.fetchone("SELECT COUNT(*) AS count FROM schema_info;")
        if result["count"] == 0:
            logger.info("Inserindo o registro inicial na tabela schema_info")
            await db.insert("INSERT INTO schema_info (version) VALUES (0);")
        else:
            logger.info("Tabela schema_info já existe e contém registros.")

class DbUpgrade:
    versions_dir = "./migrations/versions/"

    def __init__(self):
        asyncio.run(init_db().create())

    async def get_schema_version(self) -> int:
        try:
            result = await db.fetchone("SELECT version FROM schema_info")
            return result["version"]
        except asyncmy.errors.ProgrammingError as e:
            logger.error(str(e))
            return 0

    async def get_modules_versions(self, action: str, versions_dir: str, current_version: int, target_version: int | None = None) -> list:
        if action == "up":
            files = sorted(os.listdir(versions_dir))
        else:
            files = sorted(os.listdir(versions_dir), reverse=True)
        files = [f for f in files if f.endswith(".py") and not f.startswith("__init__")]
        if files:
            if action == "up":
                files = [f for f in files if int(f.split(".")[0]) > current_version]
                if target_version:
                    files = [f for f in files if int(f.split(".")[0]) <= target_version]
            elif action == "down":
                files = [f for f in files if int(f.split(".")[0]) <= current_version]
                if target_version:
                    files = [f for f in files if int(f.split(".")[0]) > target_version]
            return files

    async def save_target_version(self, target_version: int):
        if target_version is not None:
            await db.update("UPDATE schema_info SET version=%s", (target_version, ))

    async def run_up(self, target_version: int):
        current_version = await self.get_schema_version()
        files = await self.get_modules_versions("up", self.versions_dir, current_version, target_version)
        
        if not files:
            logger.info(f"Current version: {current_version}")
            logger.info("No changes to do.")
            return
        
        for ifile, file_name in enumerate(files):
            try:
                module_name = os.path.splitext(file_name)[0]
                module_version = int(module_name.split(".")[0])
                file_path = os.path.join(self.versions_dir, file_name)
                spec = importlib.util.spec_from_file_location(module_name, file_path)
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)
            
                if hasattr(module, "up"):
                    print(f"Running up() method from {file_name}")
                    await module.up()

                await self.save_target_version(module_version)
            except Exception as e:
                logger.error(f"Modulo {module_version} não implementado.")
                logger.error(str(e))


    async def run_down(self, target_version: int):
        current_version = await self.get_schema_version()
        files = await self.get_modules_versions("down", self.versions_dir, current_version, target_version)

        if not files:
            logger.info(f"Current version: {current_version}")
            logger.info("No changes to do.")
            return
        
        for file_name in files:
            module_name = os.path.splitext(file_name)[0]
            module_version = int(module_name.split(".")[0])
            file_path = os.path.join(self.versions_dir, file_name)
            spec = importlib.util.spec_from_file_location(module_name, file_path)
            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)
            
            if hasattr(module, "down"):
                print(f"Running down() method from {file_name}")
                await module.down()

        await self.save_target_version(target_version)

    async def main(self):
        if len(sys.argv) > 3:
            print("Usage: python db_upgrade.py <up/down> <optional: version number>")
            sys.exit(1)
        
        action = sys.argv[1]
        version = 0
        if len(sys.argv) > 2:
            try:
                version = int(sys.argv[2])
                print("Target version", version)
            except ValueError as e:
                print("Invalid version number.")
                print(e)
                sys.exit(1)
        
        if action == "up":
            await self.run_up(version)
        elif action == "down":
            await self.run_down(version)
        else:
            print("Invalid argument. Use 'up' or 'down'.")
            sys.exit(1)

if __name__ == "__main__":
    dbup = DbUpgrade()
    asyncio.run(dbup.main())