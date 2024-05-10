import {prisma} from "@/core/adapters/prisma";

import {IdentityStatuses} from "@/merchants/types";

export default async function editMerchantIdentity(
  merchantId: string,
  status: IdentityStatuses
) {
  return prisma.merchantIdentity.update({
    where: {
      merchantId: merchantId,
    },
    data: {
      identityStatus: status,
    },
  });
}
