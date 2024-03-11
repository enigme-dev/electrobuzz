import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { z } from "zod";
import { buildErr } from "@/core/lib/errors";
import getAddress from "@/addresses/queries/getAddress";
import { AddressModel, AddressSchema } from "@/addresses/types";
import editAddress from "@/addresses/mutations/editAddress";
import deleteAddress from "@/addresses/mutations/deleteAddress";
import { Prisma } from "@prisma/client";

interface IdParams {
  params: { id: string };
}

export async function GET(req: NextRequest, { params }: IdParams) {
  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const addressId = z.string().cuid().safeParse(params.id);
  if (!addressId.success) {
    return buildErr("ErrValidation", 400, "invalid address id");
  }

  let address;
  try {
    address = await getAddress(addressId.data);
    if (address?.userId !== userId.data) {
      return buildErr("ErrNotFound", 404, "invalid address id");
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2001") {
        return buildErr("ErrNotFound", 404, "invalid address id");
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  const result: AddressModel = {
    addressId: address.addressId,
    addressDetail: address.addressDetail,
    addressZipCode: address.addressZipCode,
    addressCity: address.addressCity,
    addressProvince: address.addressProvince,
  };

  return Response.json({ data: result });
}

export async function PATCH(req: NextRequest, { params }: IdParams) {
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

  let address;
  try {
    address = await getAddress(addressId.data);
    if (address?.userId !== userId.data) {
      return buildErr("ErrNotFound", 404, "invalid address id");
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2001") {
        return buildErr("ErrNotFound", 404, "invalid address id");
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  try {
    await editAddress(userId.data, addressId.data, data.data);
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({ status: "updated successfully" });
}

export async function DELETE(req: NextRequest, { params }: IdParams) {
  const token = await getToken({ req });

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const addressId = z.string().cuid().safeParse(params.id);
  if (!addressId.success) {
    return buildErr("ErrValidation", 400, "invalid address id");
  }

  let address;
  try {
    address = await getAddress(addressId.data);
    if (address?.userId !== userId.data) {
      return buildErr("ErrNotFound", 404, "invalid address id");
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2001") {
        return buildErr("ErrNotFound", 404, "invalid address id");
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  try {
    await deleteAddress(addressId.data);
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({ status: "deleted successfully" });
}
