import { sendVerificationEmail } from "@/helpers/sendVerificationemail";
import { connectToDatabase } from "@/lib/dbConfig";
import User from "@/models/user.model";
import ApiResponse from "@/types/ApiResponse";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email } = await request.json();
    const user = await User.findOne({ email });
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
    const verificationToken = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000);
    user.verificationToken = verificationToken;
    user.ExpiresAt = expirationTime;
    await user.save();
    const emailResponse = await sendVerificationEmail(
      user.email,
      user.name,
      verificationToken
    );
    if (!emailResponse.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Failed to send verification email",
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Verification email resent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resending verification email:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while resending verification email",
      },
      { status: 500 }
    );
  }
}
