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
        email: {
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
      async authorize(credentials: any): Promise<any> {
        //connect to database and find user by email
        await connectToDatabase();
        try {
          const user = await User.findOne({ email: credentials.identifier });
          if (!user) {
            throw new Error("No user found with this email.");
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
            throw new Error("Invalid password. Please try again.");
          }
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  //callbacks to include user ID and verification status in JWT token and session
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Runs only on initial sign-in
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.email = user.email;
        token.currency = user.currency;
        token.name = user.name;
      }

      // Runs when update() is called from client
      if (trigger === "update" && session) {
        token.name = session.name;
        token.currency = session.currency;

        token.isVerified = session.isVerified;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.email = token.email;
        session.user.currency = token.currency;
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
  },
  secret: process.env.NEXTAUTH_SECRET,
};
