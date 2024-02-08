FROM node:lts-alpine

WORKDIR /app

COPY ./package*.json .

RUN npm install -g @nestjs/cli

RUN npm install -f

COPY . .

CMD [ "npm", "run", "start:dev" ]
