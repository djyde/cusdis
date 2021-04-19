FROM node:15.14.0-alpine3.10

ARG DB_TYPE=sqlite

RUN apk add --no-cache python3 py3-pip make gcc g++
RUN npm i -g pnpm

COPY package.json /app

WORKDIR /app

RUN pnpm i

COPY . /app

RUN npm run build:without-migrate

EXPOSE 3000/tcp

CMD ["npm", "run", "start:with-migrate"]