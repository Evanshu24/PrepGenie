# ---------- Stage 1: build C++ parser ----------
FROM debian:bookworm-slim AS cpp
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential cmake pkg-config \
    libzip-dev libpugixml-dev libpoppler-cpp-dev nlohmann-json3-dev \
    && rm -rf /var/lib/apt/lists/* \
    && touch /usr/bin/zipcmp /usr/bin/zipmerge /usr/bin/ziptorrent /usr/bin/ziptool \
    && chmod +x /usr/bin/zipcmp /usr/bin/zipmerge /usr/bin/ziptorrent /usr/bin/ziptool
WORKDIR /cpp
COPY Backend/parser/ .
RUN cmake -B build -DCMAKE_BUILD_TYPE=Release && cmake --build build

# ---------- Stage 2: build frontend ----------
FROM node:22-bookworm-slim AS frontend
WORKDIR /fe
COPY Frontend/package*.json ./
RUN npm ci
COPY Frontend/ .
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
RUN npm run build

# ---------- Stage 3: runtime ----------
FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-venv nginx supervisor gettext-base ffmpeg \
    libzip4 libpugixml1v5 libpoppler-cpp0v5 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# parser binary
COPY --from=cpp /cpp/build/resume_parser /app/bin/resume_parser

# frontend static files
COPY --from=frontend /fe/dist /app/frontend

# python deps
COPY AI/requirements.txt /app/AI/requirements.txt
RUN python3 -m venv /venv && /venv/bin/pip install --no-cache-dir -r /app/AI/requirements.txt

# backend deps
COPY Backend/package*.json /app/Backend/
RUN cd /app/Backend && npm ci --omit=dev

# app code
COPY Backend/ /app/Backend/
COPY AI/ /app/AI/
RUN mkdir -p /app/Backend/Uploads

# config
COPY supervisord.conf /etc/supervisord.conf
COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV NGINX_PORT=10000
ENV PARSER_BINARY=/app/bin/resume_parser
EXPOSE 10000
CMD ["/app/start.sh"]
