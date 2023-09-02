ARG NODE_VERSION=18-slim

# Build phase
FROM node:$NODE_VERSION AS builder
WORKDIR /app

# Prepare node_modules
COPY ./ ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile


# Run phase
FROM node:$NODE_VERSION AS runner

LABEL org.opencontainers.image.source=https://github.com/xpadev-net/geekmeet_frontend
WORKDIR /app

COPY --from=builder /app ./

# Copy artifacts
CMD ["bash","./start.sh"]