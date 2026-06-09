import { connectToDatabase } from "@/lib/dbConfig";
import User from "@/models/user.model";
import  ApiResponse from "@/types/ApiResponse";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { email, verificationToken } = await request.json();

    const decodedEmail = decodeURIComponent(email);
    const user = await User.findOne({ email: decodedEmail });

    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: "User not found",
      };
      return new Response(JSON.stringify(response), { status: 404 });
    }
    if (user.isVerified) {
      const response: ApiResponse = {
        success: false,
        message: "Email already verified",
      };
      return new Response(JSON.stringify(response), { status: 400 });
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
      return new Response(JSON.stringify(response), { status: 400 });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.ExpiresAt = undefined;
    await user.save();
    const response: ApiResponse = {
      success: true,
      message: "Email verified successfully",
    };
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    console.error("Error verifying email:", error);
    const response: ApiResponse = {
      success: false,
      message: "An error occurred while verifying email",
    };
    return new Response(JSON.stringify(response), { status: 500 });
  }
}
