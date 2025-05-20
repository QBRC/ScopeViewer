# FROM ubuntu:22.04

# RUN apt-get update && \
#     apt-get install -y --no-install-recommends \
#       curl \
#       ca-certificates \
#       xz-utils \
#       build-essential \
#       python3 \
#       git \
#       bash && \
#     rm -rf /var/lib/apt/lists/*

# WORKDIR /app

# # Unpack Node 17.9.1
# COPY iviewer-remoteurl/node-v17.9.1-linux-x64.tar.xz ./
# RUN mkdir -p /usr/local/node \
#  && tar -xJf node-v17.9.1-linux-x64.tar.xz -C /usr/local/node --strip-components=1 \
#  && rm node-v17.9.1-linux-x64.tar.xz

FROM node:17-bullseye-slim

WORKDIR /app

# Install build deps (if you need any native modules)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      make g++ python3 && \
    rm -rf /var/lib/apt/lists/*

# Put node & npm on PATH
# ENV PATH=/usr/local/node/bin:$PATH

# Copy package manifests, install deps
COPY iviewer-remoteurl/package*.json ./
RUN npm install

COPY iviewer-remoteurl/public ./public
COPY iviewer-remoteurl/src    ./src
COPY iviewer-remoteurl/.env ./.env

# Expose dev port
EXPOSE 3000

# Start React in dev mode
CMD ["npm", "start"]
