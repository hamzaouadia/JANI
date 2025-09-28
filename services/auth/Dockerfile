FROM node:20-bullseye

WORKDIR /app

RUN apt-get update && apt-get install -y curl bash

COPY package.json package-lock.json* ./

COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN npm install
RUN npx prisma generate

CMD ["npm", "run", "dev"]
