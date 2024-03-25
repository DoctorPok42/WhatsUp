FROM node:alpine

ARG SERVER_URL

ENV SERVER_URL=$SERVER_URL
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY src/ ./src/
COPY public ./public/
COPY components ./components/
COPY tsconfig.json .
COPY next.config.js .

RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]

