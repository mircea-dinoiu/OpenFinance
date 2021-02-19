FROM node:14

WORKDIR /financial

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

CMD [ "yarn", "nodemon" ]
