import { connectToDatabase } from "@/lib/dbConfig";
import User from "@/models/user.model";
import ApiResponse from "@/types/ApiResponse";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email, verificationToken } = await request.json();

    const decodedEmail = decodeURIComponent(email);
    const user = await User.findOne({ email: decodedEmail });

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    if (user.isVerified) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Email already verified",
        },
        { status: 400 }
      );
    }
    const isCodeValid = user.verificationToken === verificationToken;
    const isCodeNotExpired = user.ExpiresAt
      ? user.ExpiresAt > new Date()
      : false;
    if (!isCodeValid || !isCodeNotExpired) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid or expired verification code",
        },
        { status: 400 }
      );
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.ExpiresAt = undefined;
    await user.save();
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Email verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while verifying email",
      },
      { status: 500 }
    );
  }
}
