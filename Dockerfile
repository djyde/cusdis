FROM node:16-alpine

ARG DATABASE_URL

ARG EnvironmentVariable

ADD . /app
WORKDIR /app

RUN apk update
RUN apk add python3 make g++
RUN npm i -g pnpm
RUN pnpm i
RUN npm run build

EXPOSE 3000
CMD ["npm start"]