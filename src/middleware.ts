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
