import {BaseRepository} from "@/core/repositories/BaseRepository";
import {SearchParams} from "@/core/lib/utils";
import {RegisterMerchantSchema} from "@/merchants/types";
import {AlgoliaClient} from "@/core/adapters/algolia";

export class MerchantRepository extends BaseRepository {
  private static readonly index = AlgoliaClient.initIndex("merchants");

  static count(options?: SearchParams) {
    return this.db.merchant.count({
      where: {
        merchantName: {
          contains: options?.query,
          mode: "insensitive",
        },
      },
    });
  }

  static create(userId: string, data: RegisterMerchantSchema) {
    return this.db.merchant.create({
      data: {
        merchantId: userId,
        merchantName: data.merchantName,
        merchantDesc: data.merchantDesc,
        merchantCity: data.merchantCity,
        merchantProvince: data.merchantProvince,
        merchantLat: data.merchantLat,
        merchantLong: data.merchantLong,
        merchantCategory: data.merchantCategory,
        merchantPhotoUrl: data.merchantPhotoUrl,
        merchantIdentity: {
          create: {
            identityStatus: data.merchantIdentity.identityStatus,
            identityKTP: data.merchantIdentity.identityKTP,
            identitySKCK: data.merchantIdentity.identitySKCK,
            identityDocs: data.merchantIdentity.identityDocs,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  static createIndex(data: any) {
    return this.index.saveObject({
      objectID: data.merchantId,
      _tags: data.merchantCategory,
      merchantName: data.merchantName,
      merchantPhotoUrl: data.merchantPhotoUrl,
      merchantCity: data.merchantCity,
      merchantLat: data.merchantLat,
      merchantLong: data.merchantLong,
      isAvailable: data.merchantAvailable,
    });
  }

  static findAll(options?: SearchParams) {
    return this.db.merchant.findMany({
      skip: options?.page,
      take: 10,
      where: {
        merchantName: {
          contains: options?.query,
          mode: "insensitive",
        },
      },
      include: {
        merchantIdentity: {
          select: {
            identityStatus: true,
          },
        },
      },
    });
  }

  static findOne(id: string) {
    return this.db.merchant.findUniqueOrThrow({
      where: {
        merchantId: id,
      },
      include: {
        merchantAlbums: {
          select: {merchantAlbumId: true, albumPhotoUrl: true},
        },
      },
    });
  }
}