FROM node:12.18.2

WORKDIR /usr/src/app

ENV NODE_ENV=development

COPY package.json yarn.lock tsconfig.base.json ./

EXPOSE 3000

CMD yarn && yarn --cwd packages/backend dev
