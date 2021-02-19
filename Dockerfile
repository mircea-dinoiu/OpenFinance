FROM node:14

WORKDIR /financial

COPY package.json ./
COPY yarn.lock ./

RUN yarn install
RUN yarn global add nodemon

COPY . .

EXPOSE 3000 3001
CMD [ "yarn", "start:dev" ]