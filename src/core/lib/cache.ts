import NodeCache from "node-cache";

export class Cache {
  private static instance: NodeCache;

  private static init(): NodeCache {
    if (!Cache.instance) {
      Cache.instance = new NodeCache();
    }

    return Cache.instance;
  }

  public static set(key: string, val: any, ttl = 3600) {
    Cache.init().set(key, val, ttl);
  }

  public static get(key: string) {
    return Cache.init().get(key);
  }

  public static delete(key: string) {
    Cache.init().del(key);
  }
}
