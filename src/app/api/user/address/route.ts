import { buildErr } from "@/core/lib/errors";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";
import { addAddress, getAddresses } from "@/users/services/AddressService";
import { buildRes } from "@/core/lib/utils";
import { AddressSchema } from "@/users/types";

export async function GET(req: NextRequest) {
  let addresses;
  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  try {
    [addresses] = await getAddresses(userId.data);
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ data: addresses });
}

export async function POST(req: NextRequest) {
  let body, added;

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

  try {
    added = await addAddress(userId.data, data.data);
  } catch (e) {
    console.error(e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2001") {
        return buildErr("ErrNotFound", 404, "invalid user id");
      }
    }

    if (e instanceof Error) {
      if (e.message === "maximum number of addresses has reached") {
        return buildErr("ErrValidation", 400, e.message);
      }
    }

    return buildErr("ErrUnknown", 500);
  }

  return buildRes({
    status: "address added successfully",
    data: { id: added.addressId },
  });
}
