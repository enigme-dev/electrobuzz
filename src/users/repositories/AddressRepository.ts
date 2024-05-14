import { BaseRepository } from "@/core/repositories/BaseRepository";

import { AddressModel } from "@/users/types";
import { Prisma } from "@prisma/client";

export class AddressRepository extends BaseRepository {
  static create(userId: string, data: AddressModel) {
    return this.db.$transaction(
      async (tx) => {
        const totalAddr = await tx.address.count({ where: { userId } });

        if (totalAddr >= 3)
          throw new Error("maximum number of addresses has reached");

        const created = await tx.address.create({
          data: {
            addressDetail: data.addressDetail,
            addressCity: data.addressCity,
            addressProvince: data.addressProvince,
            addressZipCode: data.addressZipCode,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });
        return created;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
  }

  static delete(id: string) {
    return this.db.address.delete({ where: { addressId: id } });
  }

  static findAll(userId: string) {
    return this.db.$transaction([
      this.db.address.findMany({
        where: {
          userId: userId,
        },
        select: {
          addressId: true,
          addressDetail: true,
          addressZipCode: true,
          addressCity: true,
          addressProvince: true,
          userId: false,
          user: false,
        },
      }),
      this.db.address.count({ where: { userId } }),
    ]);
  }

  static findOne(id: string) {
    return this.db.address.findUnique({
      where: {
        addressId: id,
      },
      select: {
        addressId: true,
        addressDetail: true,
        addressZipCode: true,
        addressCity: true,
        addressProvince: true,
        userId: true,
        user: false,
      },
    });
  }

  static update(id: string, data: AddressModel) {
    return this.db.address.update({ where: { addressId: id }, data });
  }
}
