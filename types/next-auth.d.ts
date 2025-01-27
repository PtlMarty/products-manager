// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    shopId?: string; // Add shopId to the session object
    shopName?: string; // Optionally add shopName
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
    };
  }

  interface JWT {
    shopId?: string; // Add shopId to the JWT token
    shopName?: string; // Optionally add shopName
    id?: string;
  }
}
