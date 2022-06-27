<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">



.

.
 
# INSTALLATION
## Installation using docker-compose

### This method creates the redis instance automatically.
```bash
$ docker-compose up --build
```
.

. 

## Installation using local nodejs server

### 1. Previous
A redis server running locally is required
```bash
$ redis-cli PING
> PONG
```

### 2. Installation
```bash
$ npm install
```
### 3.Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# Test endpoint
### To test the endpoint /route use the CURL:

```bash
curl --location --request POST 'http://localhost:3000/route' \
--header 'Content-Type: application/json' \
--data-raw '{
    "maximun_distance": 100,
    "considerer_traffic": true,
    "plot": false,
    "maximun_distance_between_points": 100
}'
```

