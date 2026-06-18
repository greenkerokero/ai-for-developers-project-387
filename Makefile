.PHONY: install start build dev lint format test typecheck docker-build docker-run

PORT ?= 3000

install:
	npm install
	cd frontend && npm install --legacy-peer-deps
	cd backend && uv sync
	cd e2e && npm install

build:
	npm run compile
	cd frontend && npm run generate:api
	cd frontend && npm run build

start:
	cd backend && PORT=$(PORT) uv run gunicorn config.wsgi:application --bind 0.0.0.0:$(PORT)

dev:
	npx -y concurrently "cd backend && uv run python manage.py runserver 3000" "cd frontend && npm run dev"

lint:
	cd frontend && npm run lint
	cd backend && uv run ruff check .

format:
	cd backend && uv run black .

test:
	cd e2e && npx playwright test

typecheck:
	cd frontend && npx tsc --noEmit

docker-build:
	docker build -t booking-app .

docker-run:
	docker run -p 3000:3000 -e PORT=3000 booking-app
