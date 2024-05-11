import {prisma} from "@/core/adapters/prisma";

export abstract class BaseRepository {
  protected static readonly db = prisma;
}