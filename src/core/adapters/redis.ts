import Redis from "ioredis";

export const RedisClient = new Redis(process.env.REDIS_URL as string);

export const CacheClient = new Redis(process.env.REDIS_CACHE_URL as string);
