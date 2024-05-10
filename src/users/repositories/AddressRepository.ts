import {BaseRepository} from "@/core/repositories/BaseRepository";

import {AddressModel} from "@/users/types";

export class AddressRepository extends BaseRepository {
  static count(userId: string) {
    return this.db.address.count({where: {userId: userId}});
  }

  static create(userId: string, data: AddressModel) {
    return this.db.address.create({
      data: {
        addressDetail: data.addressDetail,
        addressCity: data.addressCity,
        addressProvince: data.addressProvince,
        addressZipCode: data.addressZipCode,
        user: {
          connect: {
            id: userId
          }
        }
      }
    })
  }

  static delete(id: string) {
    return this.db.address.delete({where: {addressId: id}})
  }

  static findAll(userId: string) {
    return this.db.address.findMany({
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
    });
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
    return this.db.address.update({where: {addressId: id}, data})
  }
}