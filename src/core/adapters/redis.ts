import Redis from "ioredis";
import { Logger } from "../lib/logger";

export const RedisClient = new Redis(process.env.REDIS_URL as string);
RedisClient.on("error", (e) => {
  Logger.error("RedisClient", e.message, e);
});

export const CacheClient = new Redis(process.env.REDIS_CACHE_URL as string);
CacheClient.on("error", (e) => {
  Logger.error("CacheClient", e.message, e);
});
