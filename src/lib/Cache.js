const Redis = require("ioredis");

const redisConfig = require("../config/redis");

class Cache {
  constructor() {
    const config = { ...redisConfig, keyPrefix: "cache:" };

    this.redis = new Redis(config);
  }

  set(key, value) {
    return this.redis.set(key, JSON.stringify(value), "EX", 60 * 60 * 24);
  }

  async get(key) {
    const cached = await this.redis.get(key);

    return cached ? JSON.parse(cached) : null;
  }

  invalidate(key) {
    return this.redis.del(key);
  }

  async invalidatePrefix(prefix) {
    const keys = await this.redis.keys(`cache:${prefix}:*`);

    const keysWithoutPrefix = keys.map((key) => key.replace("cache:", ""));

    return this.redis.del(keysWithoutPrefix);
  }
}

module.exports = new Cache();
