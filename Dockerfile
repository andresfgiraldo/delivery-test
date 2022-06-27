FROM node:14.19.3-alpine
WORKDIR /usr/src/app
COPY . ./
RUN npm install
RUN npm run build
CMD [ "node", "dist/main.js" ]
EXPOSE 3000
