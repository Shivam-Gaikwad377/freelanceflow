import User from "@/models/user.model";
import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";
import { emailSchema } from "@/schemas/email.schema";
import { sendPasswordResetEmail } from "@/helpers/sendPasswordResetEmail";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email } = await request.json();
    const parseResult = emailSchema.safeParse({ email });
    if (!parseResult.success) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid email format",
      };
      return NextResponse.json(response, { status: 400 });
    }
    const user = await User.findOne({ email });
    if (!user) {
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
    user.verificationToken = verificationToken;
    user.ExpiresAt = expirationTime;
    await user.save();
    const emailResponse = await sendPasswordResetEmail(
      user.email,
      user.name,
      verificationToken
    );
    if (!emailResponse.success) {
      const response: ApiResponse = {
        success: false,
        message: "Failed to send password reset email",
      };
      return NextResponse.json(response, { status: 500 });
    }
    const response: ApiResponse = {
      success: true,
      message: "Password reset email sent successfully",
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in forgot password process:", error);
    const response: ApiResponse = {
      success: false,
      message: "An error occurred while processing forgot password request",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
