# ========= BUILD =========
FROM node:13.10.1-alpine as builder

WORKDIR /app

COPY package.json .
COPY yarn.lock .
RUN yarn install --production=true

COPY . .

RUN yarn build

# ========= RUN =========
FROM nginx:alpine

COPY conf/nginx/frontend/nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build /usr/share/nginx/html
