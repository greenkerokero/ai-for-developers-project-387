# Stage 1: Build frontend
FROM node:24-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps
COPY frontend/ ./
RUN npm run build

# Stage 2: Runtime
FROM python:3.12-slim AS runtime
WORKDIR /app

# Install uv
RUN pip install uv

# Copy backend files
COPY backend/ /app/backend/

# Install python dependencies using uv
WORKDIR /app/backend
RUN uv sync --frozen

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist /app/frontend/dist

# Expose port and run gunicorn
EXPOSE $PORT
CMD uv run gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-3000}
