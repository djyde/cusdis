FROM node:15.14.0-alpine3.10

VOLUME [ "/data" ]

ARG DB_TYPE=sqlite
ENV DB_TYPE=$DB_TYPE

RUN apk add --no-cache python3 py3-pip make gcc g++
RUN npm i -g pnpm

COPY package.json pnpm-lock.yaml /app/

WORKDIR /app

RUN pnpm i

COPY . /app

RUN npm run build:without-migrate

EXPOSE 3000/tcp

CMD ["npm", "run", "start:with-migrate"]