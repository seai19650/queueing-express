FROM node:10-slim
RUN npm install pm2 -g

WORKDIR /app
COPY package*.json .
RUN npm install

CMD ["npm", "start"]

EXPOSE 3000