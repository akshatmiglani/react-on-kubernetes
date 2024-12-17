FROM node:20

WORKDIR /drawing-app

COPY drawing-app/package.json ./

RUN npm install

COPY drawing-app/ ./

EXPOSE 5173

CMD ["npm","run","dev","--","--host","0.0.0.0"]