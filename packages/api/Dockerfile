FROM node:16-alpine

RUN apk add git

WORKDIR /usr/src/app

COPY . ./

RUN yarn

EXPOSE 3000

RUN yarn build

CMD [ "node", "dist/server.js" ]
