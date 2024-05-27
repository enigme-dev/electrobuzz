import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { buildErr } from "@/core/lib/errors";
import { Prisma } from "@prisma/client";
import { buildRes, IdParam } from "@/core/lib/utils";
import {
  getAddress,
  editAddress,
  deleteAddress,
} from "@/users/services/AddressService";
import { AddressSchema } from "@/users/types";
import { Logger } from "@/core/lib/logger";

export async function GET(req: NextRequest, { params }: IdParam) {
  let address;
  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const addressId = z.string().cuid().safeParse(params.id);
  if (!addressId.success) {
    return buildErr("ErrValidation", 400, "invalid address id");
  }

  try {
    address = await getAddress(userId.data, addressId.data);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2001") {
        return buildErr("ErrNotFound", 404, "invalid address id");
      }
    }

    if (e instanceof Error) {
      if (e.message === "user does not own this address") {
        return buildErr("ErrNotFound", 404, "invalid address id");
      }
    }

    Logger.error("address", "get address error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ data: address });
}

export async function PATCH(req: NextRequest, { params }: IdParam) {
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

  const addressId = z.string().cuid().safeParse(params.id);
  if (!addressId.success) {
    return buildErr("ErrValidation", 400, "invalid address id");
  }

  const data = AddressSchema.safeParse(body);
  if (!data.success) {
    return buildErr("ErrValidation", 400, data.error);
  }

  try {
    await editAddress(userId.data, addressId.data, data.data);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2001") {
        return buildErr("ErrNotFound", 404, "invalid address id");
      }
    }

    if (e instanceof Error) {
      if (e.message === "user does not own this address") {
        return buildErr("ErrNotFound", 404, "invalid address id");
      }
    }

    Logger.error("address", "update address error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ status: "address updated successfully" });
}

export async function DELETE(req: NextRequest, { params }: IdParam) {
  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const addressId = z.string().cuid().safeParse(params.id);
  if (!addressId.success) {
    return buildErr("ErrValidation", 400, "invalid address id");
  }

  try {
    await deleteAddress(userId.data, addressId.data);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2001") {
        return buildErr("ErrNotFound", 404, "invalid address id");
      }
    }

    if (e instanceof Error) {
      if (e.message === "user does not own this address") {
        return buildErr("ErrNotFound", 404, "invalid address id");
      }
    }

    Logger.error("address", "delete address error", e);
    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ status: "address deleted successfully" });
}
