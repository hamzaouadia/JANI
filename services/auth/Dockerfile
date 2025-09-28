FROM node:20-bullseye

WORKDIR /app

RUN apt-get update && apt-get install -y curl bash

COPY package.json package-lock.json* ./

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm install -g npm@11.6.1
RUN npx prisma generate

CMD ["npm", "run", "dev"]
