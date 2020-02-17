FROM node:12-alpine

# Preparing Dependencies
WORKDIR /app
COPY ./package.json ./
RUN npm install

# Copy Files
COPY . .
CMD ["npm", "run", "production"]

EXPOSE 3000