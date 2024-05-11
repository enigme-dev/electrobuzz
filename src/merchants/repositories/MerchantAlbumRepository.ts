import {BaseRepository} from "@/core/repositories/BaseRepository";

export type MerchantAlbum = {
  merchantId: string;
  albumPhotoUrl: string;
}

export class MerchantAlbumRepository extends BaseRepository {
  static count(merchantId: string) {
    return this.db.merchant.count({where: {merchantId: merchantId}});
  }

  static createMany(data: MerchantAlbum[]) {
    return this.db.merchantAlbum.createMany({data});
  }

  static delete(id: string) {
    return this.db.merchantAlbum.delete({where: {merchantAlbumId: id}});
  }

  static findAll(merchantId: string) {
    return this.db.merchantAlbum.findMany({
      where: {
        merchantId: merchantId,
      },
    });
  }

  static findOne(id: string) {
    return this.db.merchantAlbum.findUniqueOrThrow({where: {merchantAlbumId: id}});
  }
}