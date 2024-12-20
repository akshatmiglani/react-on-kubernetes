FROM node:20 AS build

WORKDIR /drawing-app

COPY drawing-app/package.json ./

RUN npm install

COPY drawing-app/ ./

RUN npm run build

FROM nginx:1.21.5-alpine as release

COPY --from=build /drawing-app/dist /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx","-g","daemon off;"]