FROM node:latest

WORKDIR /node

COPY package*.json ./

COPY . .

EXPOSE 7002

RUN npm install
CMD ["npm", "run", "dev"]
