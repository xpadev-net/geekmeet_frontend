ARG NODE_VERSION=18-slim

# Build phase
FROM node:$NODE_VERSION AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9
RUN pnpm install --frozen-lockfile

# Prepare node_modules
COPY ./ ./

# Run phase
FROM node:$NODE_VERSION AS runner

LABEL org.opencontainers.image.source=https://github.com/xpadev-net/geekmeet_frontend
WORKDIR /app

COPY --from=builder /app ./

COPY ./docker/.env.placeholder ./.env

RUN npx prisma generate
RUN npm run build

COPY ./docker/env-replacer.sh ./

RUN chmod +x ./env-replacer.sh
RUN chmod +x ./start.sh
ENTRYPOINT [ "/app/env-replacer.sh" ]

# Copy artifacts
CMD ["./start.sh"]
