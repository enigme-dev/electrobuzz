import { CacheClient } from "../adapters/redis";
import { Logger } from "./logger";

const CACHE_REQUEST_TIMEOUT = 1000; // 1 second

type GetCacheOptions = {
  timeout: number;
};

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

  public static async get(key: string, options?: GetCacheOptions) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve(null);
      }, options?.timeout ?? CACHE_REQUEST_TIMEOUT);

      CacheClient.get(key).then((res) => {
        clearTimeout(timer);
        if (!res || res === "") {
          resolve(null);
        } else {
          resolve(JSON.parse(res));
        }
      });
    });
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
