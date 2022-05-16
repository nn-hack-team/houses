FROM node:lts-alpine as build-step
WORKDIR /src
ENV PATH /src/node_modules/.bin:$PATH
COPY package.json  ./
COPY package-lock.json ./
RUN npm install
COPY ./src ./src
COPY ./public ./public
RUN npm run build

# Build step #2: build an Caddy container
FROM caddy:alpine
EXPOSE 80
EXPOSE 443
COPY --from=build-step /src/build /usr/share/caddy