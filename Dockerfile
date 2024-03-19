FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY .env ./
COPY src/ ./src/
COPY public ./public/
COPY components ./components/
COPY tsconfig.json .
COPY next.config.mjs .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
