FROM node:18-alpine

WORKDIR /server

COPY package.json ./

COPY yarn.lock ./

RUN yarn global add nodemon

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 5000

CMD ["npm","run","dev"]
