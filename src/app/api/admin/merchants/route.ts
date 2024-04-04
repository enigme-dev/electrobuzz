import { buildErr } from "@/core/lib/errors";
import getIdentities from "@/merchantIdentities/queries/getIdentities";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let merchants;

  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query");

  try {
    merchants = await getIdentities(query ?? "");
  } catch (e) {
    return buildErr("ErrUnknown", 500);
  }

  return Response.json({
    status: "merchants retrieved successfully",
    data: merchants,
  });
}
