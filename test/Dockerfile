ARG NODE_VERSION
FROM node:$NODE_VERSION

ARG NODE_VERSION
ENV NODE_VERSION=$NODE_VERSION

WORKDIR /app

COPY package*.json index.js index.d.ts tsconfig.json /app/
COPY lib /app/lib
COPY test /app/test

RUN npm ci

CMD npm --no-update-notifier run jest
