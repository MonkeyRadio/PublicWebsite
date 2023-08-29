FROM node:19-alpine AS webapp-builder

LABEL maintainer="Nicolas JACQUEMIN"

# create destination directory
WORKDIR /app

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# copy the app, note .dockerignore
COPY package.json /app/
RUN npm install
COPY . .
RUN npm run generate
RUN npm prune --omit=dev

FROM nginx AS webapp

COPY --from=webapp-builder /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/proxy_params /etc/nginx/proxy_params

EXPOSE 80

CMD ["nginx", "-g daemon off;"]