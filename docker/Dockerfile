# build stage
FROM node:6.13.1 as build-stage
WORKDIR /usr/src/ember
COPY . /usr/src/ember/
COPY .env.colombia .env
RUN npm install -g ember-cli@1.13.1
RUN npm install -g bower
RUN npm install -g sass
RUN npm rebuild node-sass
RUN npm install
RUN bower install
RUN ember build --environment=production


# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /usr/src/ember/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
