/**
 * Route proxy (the Next 16 name for what was `middleware.ts`): gates the
 * admin pages and their API on a signed-in director or finance role.
 */
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
  callbacks: {
    authorized: ({ token }) =>
      token?.role === "DIRECTOR" || token?.role === "FINANCE",
  },
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
