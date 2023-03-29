# Build stage
FROM hub.lumigame.com/docker-hub/library/node:18.1-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate 

WORKDIR /app

RUN pnpm -v && pnpm store path
RUN yarn run reg && pnpm fetch --prod
RUN pnpm install --frozen-lockfile --prod
RUN pnpm dlx mod-pruner prune --force
RUN pnpm prune --prod

COPY ./src/ .

# Production stage
FROM hub.lumigame.com/docker-hub/library/node:18.1-alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
RUN mkdir /app && chown node:node /app
WORKDIR /app

USER node
ENV PATH /app/node_modules/.bin:$PATH
COPY --from=builder /app .

HEALTHCHECK --interval=10s CMD node --es-module-specifier-resolution=node healthcheck.js

CMD [ "node", "--es-module-specifier-resolution=node", "./app.js" ]
