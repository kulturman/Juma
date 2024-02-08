FROM node:lts-alpine

WORKDIR /app

COPY ./package*.json .

RUN npm install -g @nestjs/cli

RUN npm install -f

COPY . .

EXPOSE 5001

CMD [ "npm", "run", "start:dev" ]
