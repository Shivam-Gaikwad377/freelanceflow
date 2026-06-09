import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/user.model";
import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";
import { changePasswordSchema } from "@/schemas/changePassword.schema";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      const response: ApiResponse = {
        success: false,
        message: "Unauthorized",
      };
      return NextResponse.json(response, { status: 401 });
    }
    const { currentPassword, newPassword } = await request.json();
    const parseResult = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
    });
    if (!parseResult.success) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid input",
      };
      return NextResponse.json(response, { status: 400 });
    }
    await connectToDatabase();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: "User not found",
      };
      return NextResponse.json(response, { status: 404 });
    }
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      const response: ApiResponse = {
        success: false,
        message: "Current password is incorrect",
      };
      return NextResponse.json(response, { status: 400 });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    const response: ApiResponse = {
      success: true,
      message: "Password changed successfully",
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error changing password:", error);
    const response: ApiResponse = {
      success: false,
      message: "An error occurred while changing password",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
