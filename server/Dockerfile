FROM node:12.22.3

WORKDIR /financial

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production

COPY . .

CMD [ "yarn", "nodemon" ]
