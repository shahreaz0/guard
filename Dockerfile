# 1st Stage
#---------------

FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

COPY tsconfig.json .

RUN npm i 

COPY . .

RUN npm run build


# 2nd Stage
#--------------- 

FROM node:18-alpine

WORKDIR /app

RUN npm i -g pm2

COPY package*.json ./

COPY tsconfig.json .

RUN npm i --omit=dev

COPY --from=builder /app/config .

COPY --from=builder /app/dist .

EXPOSE 9119

CMD ["pm2-runtime", "./dist/server.js" ]




