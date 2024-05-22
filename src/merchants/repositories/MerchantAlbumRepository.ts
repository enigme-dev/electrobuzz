import { BaseRepository } from "@/core/repositories/BaseRepository";
import { Prisma } from "@prisma/client";
import { ALBUM_QUOTA } from "@/merchants/types";
import { ErrorCode } from "@/core/lib/errors";

export type MerchantAlbum = {
  merchantId: string;
  albumPhotoUrl: string;
};

export class MerchantAlbumRepository extends BaseRepository {
  static count(merchantId: string) {
    return this.db.merchant.count({ where: { merchantId: merchantId } });
  }

  static createMany(merchantId: string, data: MerchantAlbum[]) {
    return this.db.$transaction(
      async (tx) => {
        const count = await tx.merchantAlbum.count({ where: { merchantId } });
        const quota = ALBUM_QUOTA - count;
        if (quota < data.length) {
          throw new Error(ErrorCode.ErrAlbumQuotaExceeded);
        }

        return tx.merchantAlbum.createMany({ data });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  }

  static delete(id: string) {
    return this.db.merchantAlbum.delete({ where: { merchantAlbumId: id } });
  }

  static findAll(merchantId: string) {
    return this.db.$transaction([
      this.db.merchantAlbum.findMany({ where: { merchantId } }),
      this.db.merchantAlbum.count({ where: { merchantId } }),
    ]);
  }

  static findOne(id: string) {
    return this.db.merchantAlbum.findUniqueOrThrow({
      where: { merchantAlbumId: id },
    });
  }
}
