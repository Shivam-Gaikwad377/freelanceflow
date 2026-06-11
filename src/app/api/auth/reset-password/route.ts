import { NextResponse } from "next/server";
import User from "@/models/user.model";
import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";
import bcrypt from "bcryptjs";
import { resetPasswordSchema } from "@/schemas/resetPassword.schema";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email, verificationToken, newPassword } = await request.json();
    const user = await User.findOne({
      email,
    });
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: "User not found",
      };
      return NextResponse.json(response, { status: 404 });
    }
    const parseResult = resetPasswordSchema.safeParse({
      email,
      verificationToken,
      newPassword,
    });
    if (!parseResult.success) {
      const response: ApiResponse = {
        success: false,
        message: parseResult.error.issues.map((err) => err.message).join(", "),
      };
      return NextResponse.json(response, { status: 400 });
    }

    const isCodeValid = user.verificationToken === verificationToken;
    const isCodeNotExpired = user.ExpiresAt
      ? user.ExpiresAt > new Date()
      : false;
    if (!isCodeValid || !isCodeNotExpired) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid or expired verification code",
      };
      return NextResponse.json(response, { status: 400 });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    user.verificationToken = undefined;
    user.ExpiresAt = undefined;
    await user.save();
    const response: ApiResponse = {
      success: true,
      message: "Password reset successfully",
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error resetting password:", error);
    const response: ApiResponse = {
      success: false,
      message: "An error occurred while resetting password",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
