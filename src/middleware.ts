import { withAuth } from "next-auth/middleware";
import { buildErr } from "@/core/lib/errors";

export default withAuth(function middleware(req) {
  const isAdmin = req.nextauth.token?.isAdmin;
  if (isAdmin) {
    if (req.nextUrl.pathname.startsWith("/admin")) {
      return Response.redirect(new URL("/", req.url));
    }

    if (req.nextUrl.pathname.startsWith("/api/admin")) {
      return buildErr("ErrForbidden", 403, "user is not an admin");
    }
  }
});

export const config = { matcher: ["/admin", "/api/admin"] };
