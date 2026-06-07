import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/dbConfig";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";


export const authOptions: NextAuthOptions = {
  providers: [
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
      async authorize(credentials: any): Promise<any> {
        await connectToDatabase();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("No user found with this email.");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your email before logging in.");
          }
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
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
  callbacks: {
    async jwt({ token, user }) {
      if(user){
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.email = user.email;
        
      }
      return token;
    },
    async session({ session, token }) {
      if(token){
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.email = token.email;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
