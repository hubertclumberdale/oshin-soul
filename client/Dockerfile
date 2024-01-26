FROM node:latest

WORKDIR /client

COPY package*.json ./

RUN npm install -g react-scripts

COPY . .

EXPOSE 4002

RUN chmod +x ./docker_entrypoint.sh

ENTRYPOINT ["./docker_entrypoint.sh"]