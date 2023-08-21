# build environment
FROM node:18.3.0-buster-slim as builder
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json
RUN npm install
COPY . /usr/src/app
ARG BUILD_ENV
RUN npm run build

# deployment environment
FROM nginx:1.21.6-alpine
RUN rm -rf /etc/nginx/conf.d
COPY nginx_conf/conf /etc/nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]