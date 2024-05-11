import {BaseRepository} from "@/core/repositories/BaseRepository";
import {IdentityStatuses, MerchantIdentitiesModel} from "@/merchants/types";

export class MerchantIdentityRepository extends BaseRepository {
  static create(data: MerchantIdentitiesModel) {
    return this.db.merchantIdentity.create({
      data: {
        identityKTP: data.identityKTP,
        identitySKCK: data.identitySKCK,
        identityDocs: data.identityDocs,
        identityStatus: data.identityStatus,
        merchant: {
          connect: {
            merchantId: data.merchantId,
          },
        },
      },
    })
  }

  static findOne(merchantId: string) {
    return this.db.merchantIdentity.findUniqueOrThrow({where: {merchantId: merchantId}});
  }

  static update(merchantId: string, status: IdentityStatuses) {
    return this.db.merchantIdentity.update({
      where: {
        merchantId: merchantId,
      },
      data: {
        identityStatus: status,
      },
    });
  }
}