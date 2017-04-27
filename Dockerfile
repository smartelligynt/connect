FROM node:6.9.1
EXPOSE 3000
ENV DIR /usr/src/app
RUN mkdir -p $DIR
WORKDIR $DIR
COPY . $DIR
RUN npm install
RUN $DIR/node_modules/.bin/gulp build
CMD node src/server

