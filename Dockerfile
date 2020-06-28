FROM node:12

MAINTAINER "Tidepool developers"

RUN apt-get update && \
  apt-get install -y git curl gcc g++ make libavutil-dev libsecret-1-dev libudev-dev build-essential \
                     libc6 libusb-1.0.0-dev libusb-1.0

COPY . .

# Create app directory
WORKDIR /usr/src/app

RUN yarn install
RUN npm link webpack-cli
RUN npm install cross-env
RUN npm build
RUN npm install html-webpack-plugin

ENV NODE_ENV "development"

EXPOSE 8080

CMD ["npm", "start"]
