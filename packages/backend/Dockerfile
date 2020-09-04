FROM node:12.18.2 as builder

WORKDIR /usr/src/app

ENV NODE_ENV=development

COPY package.json yarn.lock tsconfig.base.json ./
COPY packages/backend ./packages/backend

RUN yarn --frozen-lockfile
RUN yarn --cwd packages/backend build

FROM node:12.18.2-slim

WORKDIR /usr/src/app

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y make python g++

COPY --from=builder /usr/src/app/package.json /usr/src/app/package.json
COPY --from=builder /usr/src/app/yarn.lock /usr/src/app/yarn.lock
COPY --from=builder /usr/src/app/packages/backend/package.json /usr/src/app/packages/backend/package.json
COPY --from=builder /usr/src/app/packages/backend/dist /usr/src/app/packages/backend/dist

RUN yarn --frozen-lockfile

EXPOSE 3000

CMD yarn --cwd packages/backend start