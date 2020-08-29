FROM node:12.18.2-slim

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json yarn.lock tsconfig.base.json ./
COPY packages/frontend ./packages/frontend
COPY packages/backend ./packages/backend

RUN yarn --production=false
RUN yarn --cwd packages/frontend build
RUN yarn --production=true

EXPOSE 3000

CMD yarn --cwd packages/frontend start
