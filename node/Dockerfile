FROM node:latest

WORKDIR /node

COPY package*.json ./

RUN npm install -g nodemon

COPY . .

EXPOSE 7002

RUN chmod +x ./docker_entrypoint.sh

ENTRYPOINT ["./docker_entrypoint.sh"]