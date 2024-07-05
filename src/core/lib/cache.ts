import { CacheClient } from "../adapters/redis";
import { Logger } from "./logger";

export class Cache {
  public static set(key: string, val: any, ttl = 3600) {
    if (typeof val != "string") {
      val = JSON.stringify(val);
    }

    if (ttl) {
      CacheClient.set(key, val as string, "EX", ttl);
    } else {
      CacheClient.set(key, val);
    }
  }

  public static async get(key: string) {
    const data = await CacheClient.get(key);
    if (!data || data === "") return;

    return JSON.parse(data);
  }

  public static async delete(key: string) {
    return await CacheClient.del(key);
  }

  public static async deleteWithPrefix(pattern: string) {
    const keys = await CacheClient.keys(pattern);
    Logger.debug(keys);
    return await CacheClient.del(keys);
  }
}
