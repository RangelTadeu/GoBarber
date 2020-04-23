require("dotenv/config");
const helmet = require("helmet");
const express = require("express");
const routes = require("./routes");
const path = require("path");
const cors = require("cors");

const redis = require("redis");
const RateLimit = require("express-rate-limit");
const RateLimitRedis = require("rate-limit-redis");
const redisConfig = require("./config/redis");

require("./database/index");

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(helmet());
    this.server.use(
      cors({
        origin: false,
      })
    );
    this.server.use(
      "/files",
      express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
    );

    if (process.env.NODE_ENV !== "development") {
      this.server.use(
        new RateLimit({
          store: new RateLimitRedis({
            client: redis.createClient(redisConfig),
          }),
          windowMs: 1000 * 60,
          max: 100,
        })
      );
    }
  }

  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;
