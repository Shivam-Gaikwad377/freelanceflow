import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);
//export handler for both GET and POST requests to handle authentication
export { handler as GET, handler as POST };