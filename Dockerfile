FROM node:20.10.0 AS frontend-builder

WORKDIR /app/frontend

COPY package*.json ./
COPY .env ./

RUN npm install

COPY src/ ./src/
COPY public ./public/
COPY components ./components/
COPY tsconfig.json .
COPY next.config.mjs .

COPY frontend/ .

RUN npm run build

FROM node:20.10.0 AS backend-builder

ENV TERM xterm

WORKDIR /app/server

COPY server/package*.json ./
COPY server/.env ./

RUN npm install

COPY server .

RUN npm run build

FROM node:20.10.0 AS production

WORKDIR /app

COPY --from=frontend-builder /app/frontend/.next ./.next
COPY --from=frontend-builder /app/frontend/public ./public
COPY --from=frontend-builder /app/frontend/package*.json ./
COPY --from=frontend-builder /app/frontend/next.config.mjs ./
COPY --from=frontend-builder /app/frontend/tsconfig.json ./
COPY --from=frontend-builder /app/frontend/.env ./

COPY --from=backend-builder /app/server/build ./server/build
COPY --from=backend-builder /app/server/package*.json ./server/
COPY --from=backend-builder /app/server/.env ./server/

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]

