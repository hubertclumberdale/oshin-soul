FROM node:latest

WORKDIR /client

COPY package*.json ./

RUN npm install -g react-scripts

COPY . .

EXPOSE 4002

RUN chmod +x ./docker_entrypoint.sh

ENTRYPOINT ["sh", "./docker_entrypoint.sh"]