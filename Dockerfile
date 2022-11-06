FROM node:16.13.1
WORKDIR /app
COPY package.json /app
COPY ./ ./
EXPOSE 6000
#CMD ["npm", "run", "start:dev"]