FROM node:16-alpine

ARG DATABASE_URL
ARG PORT

ARG EnvironmentVariable

ENV PORT=${PORT}

ADD . /app
WORKDIR /app

RUN apk update
RUN apk add python3 make g++
RUN npm i -g pnpm
RUN pnpm i
RUN npm run build

EXPOSE ${PORT}
CMD ["npm", "start"]