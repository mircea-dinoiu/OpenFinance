FROM node:12.22.1

WORKDIR /financial

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production

COPY . .

CMD [ "yarn", "nodemon" ]
