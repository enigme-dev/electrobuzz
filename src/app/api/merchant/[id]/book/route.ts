import getAddress from "@/addresses/queries/getAddress";
import addBooking from "@/bookings/mutations/addBooking";
import { BookingModel, BookStatusEnum } from "@/bookings/types";
import { buildErr } from "@/core/lib/errors";
import { deleteImg, uploadImg } from "@/core/lib/image";
import {buildRes, IdParam} from "@/core/lib/utils";
import getMerchant from "@/merchants/queries/getMerchant";
import { Prisma } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest, { params }: IdParam) {
  let body;
  const token = await getToken({ req });

  try {
    body = await req.json();
  } catch (e) {
    return buildErr("ErrValidation", 400);
  }

  const userId = z.string().cuid().safeParse(token?.sub);
  if (!userId.success) {
    return buildErr("ErrUnauthorized", 401);
  }

  const merchantId = z.string().cuid().safeParse(params.id);
  if (!merchantId.success) {
    return buildErr("ErrValidation", 400, "invalid merchant id");
  }

  const input = BookingModel.safeParse(body);
  if (!input.success) {
    return buildErr("ErrValidation", 400, input.error);
  }

  try {
    const merchant = await getMerchant(merchantId.data);
    if (merchant.userId === userId.data) {
      return buildErr(
        "ErrConflict",
        409,
        "user can not book their own merchant"
      );
    }
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "merchant does not exist");
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  try {
    await getAddress(input.data.addressId);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        return buildErr("ErrNotFound", 404, "address does not exist");
      }
    }
    return buildErr("ErrUnknown", 500);
  }

  try {
    input.data.userId = userId.data;
    input.data.merchantId = merchantId.data;
    input.data.bookingPhotoUrl = await uploadImg(
      Buffer.from(input.data.bookingPhotoUrl)
    );
    input.data.bookingStatus = BookStatusEnum.Enum.pending;

    await addBooking(input.data);
  } catch (e) {
    await deleteImg(input.data.bookingPhotoUrl);

    return buildErr("ErrUnknown", 500);
  }

  return buildRes({ status: "booking added successfully" });
}
