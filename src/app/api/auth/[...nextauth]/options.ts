import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/dbConfig";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    //Credentials required for login
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      //login function to validate user credentials
      async authorize(credentials: Record<"identifier" | "password", string> | undefined): Promise<any> {
        //connect to database and find user by email
        await connectToDatabase();
        try {
          if(!credentials) {
            throw new Error("Invalid email or password");
          }
          const user = await User.findOne({ email: credentials.identifier });
          if (!user) {
            throw new Error("Invalid email or password");
          }
          //check if user is verified
          if (!user.isVerified) {
            throw new Error("Please verify your email before logging in.");
          }
          //compare provided password with hashed password in database
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          //if password is valid, return user object, otherwise throw error
          if (isPasswordValid) {
            return user;
          } else {
            throw new Error("Invalid email or password");
          }
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  //callbacks to include user ID and verification status in JWT token and session
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.email = user.email;
        token.plan = user.plan;
        token.name = user.name;
      }

      // update() is a signal to re-sync from DB — never trust its payload
      // for plan/isVerified/anything auth-relevant.
      if (trigger === "update" && token._id) {
        await connectToDatabase();
        const fresh = await User.findById(token._id)
          .select("plan isVerified name businessName email")
          .lean();
        if (fresh) Object.assign(token, fresh);
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.email = token.email;
        session.user.plan = token.plan;
        session.user.name = token.name;
        session.user.businessName = token.businessName;
      }
      return session;
    },
  },
  //custom sign-in page
  pages: {
    signIn: "/login",
  },
  //use JWT strategy for session management
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds — session expires after this
    updateAge: 24 * 60 * 60, // 24 hours in seconds — session refreshed if used within maxAge
  },
  secret: process.env.NEXTAUTH_SECRET,
};
