FROM node:alpine

WORKDIR /app

COPY *.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . .

ENV APISIX_ADDRESS=172.16.101.123:9080
ENV NACOS_ADRESS=nacos-standalone:8848

CMD ['npm',"start"]

