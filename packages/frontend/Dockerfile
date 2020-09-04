FROM node:12.18.2 as builder

WORKDIR /usr/src/app

ENV NODE_ENV=development

COPY package.json yarn.lock tsconfig.base.json ./
COPY packages/frontend ./packages/frontend
COPY packages/backend ./packages/backend

RUN yarn --frozen-lockfile
RUN yarn --cwd packages/frontend build

FROM node:12.18.2-slim

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y python make

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/package.json /usr/src/app/package.json
COPY --from=builder /usr/src/app/yarn.lock /usr/src/app/yarn.lock
COPY --from=builder /usr/src/app/packages/frontend/package.json /usr/src/app/packages/frontend/package.json
COPY --from=builder /usr/src/app/packages/frontend/.next /usr/src/app/packages/backend/.next

RUN yarn --frozen-lockfile

EXPOSE 3000

CMD yarn --cwd packages/frontend start

