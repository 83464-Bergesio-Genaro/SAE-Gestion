# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_APP_NAME="SAE Gestion"
ARG VITE_SESSION_TIMEOUT=30
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_SESSION_TIMEOUT=$VITE_SESSION_TIMEOUT

RUN npm run build

FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
