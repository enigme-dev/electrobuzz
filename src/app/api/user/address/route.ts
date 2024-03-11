import addAddress from "@/addresses/mutations/addAddress";
import getAddresses from "@/addresses/queries/getAddresses";
import { AddressSchema } from "@/addresses/types";
import { buildErr } from "@/core/lib/errors";
import getAddressCount from "@/users/queries/getAddressCount";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const addresses = await getAddresses(userId.data);
  if (addresses) {
    return Response.json({ data: addresses });
  }

  return buildErr("ErrUnknown", 500);
}

export async function POST(req: NextRequest) {
  let body;

  try {
    body = await req.json();
  } catch (e) {
    return buildErr("ErrValidation", 400);
  }

  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const data = AddressSchema.safeParse(body);
  if (!data.success) {
    return buildErr("ErrValidation", 400, data.error);
  }

  const counter = await getAddressCount(userId.data);
  if (counter._count.addresses === 3) {
    return buildErr(
      "ErrConflict",
      409,
      "maximum number of addresses has reached"
    );
  }

  const added = await addAddress(userId.data, data.data);
  if (added) {
    return Response.json({
      status: "added successfully",
      data: { id: added.addressId },
    });
  }

  return buildErr("ErrUnknown", 500);
}
