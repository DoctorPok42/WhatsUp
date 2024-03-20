FROM node:alpine
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

EXPOSE 3000

CMD ["npm", "run", "start"]

