SHELL := /bin/bash

.PHONY: prod
prod:
	source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

.PHONY: db_upgrade
db_upgrade:
	source venv/bin/activate && python migrations/db_upgrade.py up

.PHONY: format
format:
	ruff --fix app/

