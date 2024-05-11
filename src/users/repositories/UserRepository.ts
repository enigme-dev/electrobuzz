import {BaseRepository} from "@/core/repositories/BaseRepository";
import {UpdateProfileModel, UpdateProfileSchema} from "@/users/types";
import {z} from "zod";

const UserUpdateModel = UpdateProfileSchema.deepPartial()

type UserUpdateModel = z.infer<typeof UserUpdateModel>

export class UserRepository extends BaseRepository {
  static findOne(id: string) {
    return this.db.user.findUniqueOrThrow({
      where: {id}
    })
  }

  static update(id: string, data: UserUpdateModel) {
    return this.db.user.update({
      where: {id}, data: {
        name: data.name,
        image: data.image,
        phone: data.phone,
        phoneVerified: data.phoneVerified,
      }
    })
  }
}