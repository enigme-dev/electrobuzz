import { PER_PAGE, SearchParams } from "@/core/lib/utils";
import { BaseRepository } from "@/core/repositories/BaseRepository";
import {
  BillingStatusEnum,
  TCreateBillingSchema,
  TCreateBillingsSchema,
} from "../types";
import { Prisma } from "@prisma/client";

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

  static findOne(merchantId: string, billingId: string) {
    return this.db.billing.findUniqueOrThrow({
      where: { billingId, merchantId },
      select: {
        billingId: true,
        billingStatus: true,
        billingAmount: true,
        billingQty: true,
        billingCreatedAt: true,
        payment: {
          select: {
            paymentId: true,
            paymentStatus: true,
            paymentAmount: true,
            paymentMethod: true,
            paymentBank: true,
            paymentDate: true,
          },
        },
      },
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
          billingStatus: options?.status,
          billingCreatedAt: { gte: options?.startDate, lte: options?.endDate },
        },
        select: {
          billingId: true,
          billingStatus: true,
          billingAmount: true,
          billingQty: true,
          billingCreatedAt: true,
        },
      }),
      this.db.billing.count({
        where: { merchantId, billingStatus: options?.status },
      }),
    ]);
  }

  static update(billingId: string, data: Prisma.BillingUpdateInput) {
    return this.db.billing.update({ where: { billingId }, data });
  }
}
