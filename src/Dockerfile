FROM node:12.22.3

WORKDIR /financial

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 3000
CMD [ "yarn", "dev" ]
