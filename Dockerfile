FROM node:16-alpine
RUN mkdir -p /usr/src/s3-media-svc
WORKDIR /usr/src/s3-media-svc
ADD . /usr/src/s3-media-svc
RUN npm install
CMD npm run start