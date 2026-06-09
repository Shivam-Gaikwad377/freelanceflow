import { sendVerificationEmail } from "@/helpers/sendVerificationemail";
import { connectToDatabase } from "@/lib/dbConfig";
import User from "@/models/user.model";
import ApiResponse from "@/types/ApiResponse";

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const { email } = await request.json();
        const user = await User.findOne({ email });
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
        const verificationToken = Math.random().toString(36).substring(2, 8).toUpperCase();
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000);
        user.verificationToken = verificationToken;
        user.ExpiresAt = expirationTime;
        await user.save();
        const emailResponse = await sendVerificationEmail(user.email, user.name, verificationToken);
        if (!emailResponse.success) {
            const response: ApiResponse = {
                success: false,
                message: "Failed to send verification email",
            };
            return new Response(JSON.stringify(response), { status: 500 });
        }
        const response: ApiResponse = {
            success: true,
            message: "Verification email resent successfully",
        };
        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        console.error("Error resending verification email:", error);
        const response: ApiResponse = {
            success: false,
            message: "An error occurred while resending verification email",
        };
        return new Response(JSON.stringify(response), { status: 500 });
    }
}