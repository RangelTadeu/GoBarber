<h1 align="center">
GoBarber
</h1>

<h4 align="center">
A scheduling app to make appointments with barbers. It also shows the provider's agenda.
</h4>

<p align="center">This project was developed at the RocketSeat GoStack Bootcamp</p>

## technologies

- [Node.js][nodejs]
- [Express](https://expressjs.com/)
- [nodemon](https://nodemon.io/)
- [Docker](https://www.docker.com/docker-community)
- [Sequelize](http://docs.sequelizejs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [node-postgres](https://www.npmjs.com/package/pg)
- [Redis](https://redis.io/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [Multer](https://github.com/expressjs/multer)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [Yup](https://www.npmjs.com/package/yup)
- [Bee Queue](https://www.npmjs.com/package/bcrypt)
- [Nodemailer](https://nodemailer.com/about/)
- [date-fns](https://date-fns.org/)
- [DotEnv](https://www.npmjs.com/package/dotenv)
- [ioredis](https://github.com/luin/ioredis)
- [cors](https://expressjs.com/en/resources/middleware/cors.html)
- [express-brute](https://www.npmjs.com/package/express-brute)
- [express-rate-limit](https://www.npmjs.com/package/express-rate-limit)
- [helmet](https://helmetjs.github.io/)

## Requirement

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/pt-BR/docs/install)

## Installation and Run

1. Run `yarn` to install dependencies;
2. Create a `.env` file like `.env.example`;
3. Run `yarn sequelize db:create` to create the database;
4. Run `yarn sequelize db:migrate` to create the tables;
5. Run `yarn dev` to initiale in dev mode;
6. Run `yarn start` to initiale in production mode;
7. Run `yarn queue` to initiale the server for the backgroud jobs.
