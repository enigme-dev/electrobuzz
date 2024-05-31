import { BaseRepository } from "@/core/repositories/BaseRepository";
import { PER_PAGE, SearchParams } from "@/core/lib/utils";
import { TCreateIndexSchema, TRegisterMerchantSchema } from "@/merchants/types";
import { AlgoliaClient } from "@/core/adapters/algolia";
import { Prisma } from "@prisma/client";
import { BookStatusEnum } from "@/bookings/types";

export class MerchantRepository extends BaseRepository {
  private static readonly index = AlgoliaClient.initIndex("merchants");

  static countBookings(bookingStatus: BookStatusEnum, options?: SearchParams) {
    return this.db.merchant.findMany({
      where: {
        merchantVerified: true,
      },
      select: {
        merchantId: true,
        _count: {
          select: {
            bookings: {
              where: {
                bookingStatus,
                bookingCreatedAt: {
                  gte: options?.startDate,
                  lte: options?.endDate,
                },
              },
            },
          },
        },
      },
    });
  }

  static create(userId: string, data: TRegisterMerchantSchema) {
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
        merchantAvailable: true,
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

  static createIndex(data: TCreateIndexSchema) {
    return this.index.saveObject({
      objectID: data.merchantId,
      merchantName: data.merchantName,
      merchantPhotoUrl: data.merchantPhotoUrl,
      merchantCity: data.merchantCity,
      merchantAvailable: data.merchantAvailable,
      _tags: data.merchantCategory,
      _geoloc: {
        lat: data.merchantLat,
        lng: data.merchantLong,
      },
      merchantRating: data.merchantRating,
      merchantReviewCt: data.merchantReviewCt,
    });
  }

  static deleteIndex(merchantId: string) {
    return this.index.deleteObject(merchantId);
  }

  static findAll(options?: SearchParams) {
    return this.db.$transaction([
      this.db.merchant.findMany({
        skip: options?.page,
        take: options?.perPage ?? PER_PAGE,
        orderBy: {
          merchantRating: "desc",
        },
        where: {
          merchantAvailable: true,
        },
        include: {
          merchantIdentity: {
            select: {
              identityStatus: true,
            },
          },
        },
      }),
      this.db.merchant.count(),
    ]);
  }

  static findAllAdmin(options?: SearchParams) {
    return this.db.$transaction([
      this.db.merchant.findMany({
        skip: options?.page,
        take: options?.perPage ?? PER_PAGE,
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
      }),
      this.db.merchant.count({
        where: {
          merchantName: {
            contains: options?.query,
            mode: "insensitive",
          },
        },
      }),
    ]);
  }

  static findOne(id: string) {
    return this.db.merchant.findUniqueOrThrow({
      where: {
        merchantId: id,
      },
      include: {
        merchantAlbums: {
          select: { merchantAlbumId: true, albumPhotoUrl: true },
        },
      },
    });
  }

  static update(id: string, data: Prisma.MerchantUpdateInput) {
    return this.db.merchant.update({
      where: {
        merchantId: id,
      },
      data: {
        merchantName: data.merchantName,
        merchantDesc: data.merchantDesc,
        merchantPhotoUrl: data.merchantPhotoUrl,
        merchantCity: data.merchantCity,
        merchantProvince: data.merchantProvince,
        merchantLat: data.merchantLat,
        merchantLong: data.merchantLong,
        merchantCategory: data.merchantCategory,
        merchantRating: data.merchantRating,
        merchantReviewCt: data.merchantReviewCt,
        merchantVerified: data.merchantVerified,
        merchantAvailable: data.merchantAvailable,
      },
    });
  }
}
