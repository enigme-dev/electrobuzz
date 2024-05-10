import {BaseRepository} from "@/core/repositories/BaseRepository";

export type MerchantAlbum = {
  merchantId: string;
  albumPhotoUrl: string;
}

export class MerchantAlbumRepository extends BaseRepository {
  static createMany(data: MerchantAlbum[]) {
    return this.db.merchantAlbum.createMany({data});
  }

  static delete(id: string) {
    return this.db.merchantAlbum.delete({where: {merchantAlbumId: id}});
  }

  static findAllByMerchantId(merchantId: string) {
  }
}