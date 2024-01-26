FROM node:latest

WORKDIR /client

COPY package*.json ./

COPY . .

EXPOSE 4002

RUN npm install
CMD ["npm", "start"]