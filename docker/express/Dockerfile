FROM node:10-slim
RUN npm install pm2 nodemon -g

WORKDIR /app
COPY package*.json .
RUN npm install

CMD ["npm", "start", "production"]

EXPOSE 3000