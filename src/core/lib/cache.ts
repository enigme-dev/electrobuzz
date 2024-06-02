import NodeCache from "node-cache";

export class Cache {
  private static instance: NodeCache;

  private static init(): NodeCache {
    if (!Cache.instance) {
      Cache.instance = new NodeCache({ checkperiod: 120 });
    }

    return Cache.instance;
  }

  public static set(key: string, val: any, ttl = 3600) {
    Cache.init().set(key, val, ttl);
  }

  public static get<T>(key: string): T | undefined {
    return Cache.init().get<T>(key);
  }

  public static getTTL(key: string) {
    return Cache.init().getTtl(key);
  }

  public static delete(key: string) {
    Cache.init().del(key);
  }

  public static deleteWithPrefix(prefix: string) {
    const keys = Cache.init()
      .keys()
      .filter((key) => key.startsWith(prefix));
    Cache.init().del(keys);
  }
}
