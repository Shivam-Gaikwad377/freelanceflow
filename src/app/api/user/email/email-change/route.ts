import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";
import { emailSchema } from "@/schemas/email.schema";
import { sendVerificationEmail } from "@/helpers/sendVerificationemail";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      const response: ApiResponse = {
        success: false,
        message: "Unauthorized",
      };
      return NextResponse.json(response, { status: 401 });
    }
    const { newEmail } = await request.json();
    const parseResult = emailSchema.safeParse({ email: newEmail });
    if (!parseResult.success) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid email format",
      };
      return NextResponse.json(response, { status: 400 });
    }
    if (newEmail === session.user.email) {
      const response: ApiResponse = {
        success: false,
        message: "New email cannot be the same as current email",
      };
      return NextResponse.json(response, { status: 400 });
    }

    await connectToDatabase();
    const isUserExists = await User.findOne({ email: newEmail });
    if (isUserExists) {
      const response: ApiResponse = {
        success: false,
        message: "Email already in use",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const existingUser = await User.findById(session.user._id);
    if (!existingUser) {
      const response: ApiResponse = {
        success: false,
        message: "User not found",
      };
      return NextResponse.json(response, { status: 404 });
    }
    const verificationToken = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000);
    existingUser.verificationToken = verificationToken;
    existingUser.ExpiresAt = expirationTime;
    existingUser.pendingEmail = newEmail;
    await existingUser.save();
    const emailResponse = await sendVerificationEmail(
      newEmail,
      existingUser.name,
      verificationToken
    );
    if (!emailResponse.success) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to send verification email",
      };
      return NextResponse.json(response, { status: 500 });
    }
    const response: ApiResponse = {
      success: true,
      message: "Verification email sent to new email address",
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error changing email:", error);
    const response: ApiResponse = {
      success: false,
      message: "An error occurred while changing email",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
