import os
import aiomysql
from dotenv import load_dotenv

load_dotenv()


class DB:
    def __init__(self):
        self.config = {
            "host": os.environ["DATABASE_HOST"],
            "user": os.environ["DATABASE_USER"],
            "password": os.environ["DATABASE_PASS"],
            "db": os.environ["DATABASE_NAME"],
        }
        self.connection = None

    async def connect(self):
        if not self.connection:
            self.connection = await aiomysql.connect(**self.config)

    async def close(self):
        if self.connection:
            self.connection.close()

    async def execute(self, sql, args=()):
        await self.connect()
        async with self.connection.cursor(aiomysql.DictCursor) as cursor:
            await cursor.execute(sql, args)
            return cursor

    async def commit(self):
        if self.connection:
            await self.connection.commit()

    async def rollback(self):
        if self.connection:
            await self.connection.rollback()

    async def insert(self, sql, args=()):
        cursor = await self.execute(sql, args)
        lastrowid = cursor.lastrowid
        await cursor.close()
        return lastrowid

    async def insertmany(self, sql, args=()):
        cursor = await self.execute(sql, args)
        rowcount = cursor.rowcount
        await cursor.close()
        return rowcount

    async def update(self, sql, args=()):
        cursor = await self.execute(sql, args)
        rowcount = cursor.rowcount
        await cursor.close()
        return rowcount

    async def fetch(self, sql, args=()):
        cursor = await self.execute(sql, args)
        rows = await cursor.fetchall()
        await cursor.close()
        return rows

    async def fetchone(self, sql, args=()):
        cursor = await self.execute(sql, args)
        row = await cursor.fetchone()
        await cursor.close()
        return row

    async def delete(self, sql, args=()):
        cursor = await self.execute(sql, args)
        rowcount = cursor.rowcount
        await cursor.close()
        return rowcount


def get_session():
    db = DB()
    yield db