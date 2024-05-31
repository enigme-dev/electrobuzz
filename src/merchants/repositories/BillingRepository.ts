import { PER_PAGE, SearchParams } from "@/core/lib/utils";
import { BaseRepository } from "@/core/repositories/BaseRepository";
import {
  BillingStatusEnum,
  TCreateBillingSchema,
  TCreateBillingsSchema,
} from "../types";

export class BillingRepository extends BaseRepository {
  static create(data: TCreateBillingSchema) {
    return this.db.billing.create({
      data: {
        billingAmount: data.billingAmount,
        billingQty: data.billingQty,
        billingStatus: data.billingStatus,
        merchant: {
          connect: { merchantId: data.merchantId },
        },
      },
    });
  }

  static createMany(data: TCreateBillingsSchema) {
    return this.db.billing.createMany({ data });
  }

  static findOne(billingId: string) {
    return this.db.billing.findUniqueOrThrow({
      where: { billingId },
      include: { payment: true },
    });
  }

  static findByMerchantId(merchantId: string, options?: SearchParams) {
    return this.db.$transaction([
      this.db.billing.findMany({
        skip: options?.page,
        take: options?.perPage ?? PER_PAGE,
        orderBy: {
          billingCreatedAt: "desc",
        },
        where: {
          merchantId,
          billingCreatedAt: { gte: options?.startDate, lte: options?.endDate },
        },
        include: { payment: true },
      }),
      this.db.billing.count({
        where: { merchantId },
      }),
    ]);
  }
}
