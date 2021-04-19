FROM node:15.14.0-alpine3.10

COPY . /app

WORKDIR /app

RUN apk add --no-cache python3 py3-pip make gcc g++

RUN npm i -g pnpm
RUN pnpm i
RUN npm run build:without-migrate

EXPOSE 3000/tcp

CMD ["npm", "run", "start:with-migrate"]