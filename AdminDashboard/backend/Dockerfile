#STAGE 1
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

#STAGE 2
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist

COPY package*.json ./
RUN npm install --production

EXPOSE 5000

CMD [ "node", "dist/server.js" ]