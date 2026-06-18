import "next-auth";
import { int } from "zod";

declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    name?: string;
    email?: string;
    currency?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      name?: string;
      email?: string;
      currency?: string;
    } & DefaultSession["user"];
  }
}
