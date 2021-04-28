FROM node:alpine

WORKDIR /app

COPY *.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . .

CMD ['npm',"start"]

