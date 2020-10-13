FROM node:12.18.2 as builder

WORKDIR /usr/src/app

ENV NODE_ENV=development

COPY package.json yarn.lock tsconfig.base.json ./
COPY packages/admin ./packages/admin
COPY packages/backend ./packages/backend

RUN yarn --frozen-lockfile
RUN yarn --cwd packages/admin build

FROM node:12.18.2-slim

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=builder /usr/src/app/package.json /usr/src/app/package.json
COPY --from=builder /usr/src/app/yarn.lock /usr/src/app/yarn.lock
COPY --from=builder /usr/src/app/packages/admin/package.json /usr/src/app/packages/admin/package.json
COPY --from=builder /usr/src/app/packages/admin/.next /usr/src/app/packages/admin/.next
# COPY --from=builder /usr/src/app/packages/admin/public /usr/src/app/packages/admin/public

RUN apt-get update && apt-get install -y python make

RUN yarn --frozen-lockfile && yarn cache clean

RUN apt-get remove -y python make
RUN apt-get autoremove -y

EXPOSE 3000

CMD yarn --cwd packages/admin start

