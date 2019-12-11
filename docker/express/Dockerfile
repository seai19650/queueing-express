FROM node:10-slim
ENV TZ=Asia/Bangkok
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN npm install pm2 nodemon -g
WORKDIR /app
COPY package*.json .
RUN npm install
CMD ["npm", "start", "production"]

EXPOSE 3000