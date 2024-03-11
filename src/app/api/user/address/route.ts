import addAddress from "@/addresses/mutations/addAddress";
import getAddresses from "@/addresses/queries/getAddresses";
import { AddressSchema } from "@/addresses/types";
import { buildErr } from "@/core/lib/errors";
import getAddressCount from "@/users/queries/getAddressCount";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  let result;
  try {
    result = await getAddresses(userId.data);
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({ data: result });
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

  try {
    const counter = await getAddressCount(userId.data);
    if (counter._count.addresses === 3) {
      return buildErr(
        "ErrConflict",
        409,
        "maximum number of addresses has reached"
      );
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2001") {
        return buildErr("ErrNotFound", 404, "invalid user id");
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  let added;
  try {
    added = await addAddress(userId.data, data.data);
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({
    status: "added successfully",
    data: { id: added.addressId },
  });
}
