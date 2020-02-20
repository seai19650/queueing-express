FROM node:12-alpine

RUN apk add tzdata && \
    cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime && \
    echo "Asia/Bangkok" >  /etc/timezone && \
    apk del tzdata

# Preparing Dependencies
WORKDIR /app
COPY ./package.json ./
RUN npm install && npm install pm2 -g

# Copy Files
COPY . .
CMD ["npm", "run", "production"]

EXPOSE 3000