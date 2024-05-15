import { NextRequest } from "next/server";
import { deleteExpiredOTP } from "@/users/services/VerificationService";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await deleteExpiredOTP();
  } catch (e) {
    console.error(e);
    return new Response("Internal Server Error", { status: 500 });
  }

  return Response.json({ success: true });
}
