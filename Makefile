SHELL := /bin/bash

.PHONY: prod
prod:
	source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
