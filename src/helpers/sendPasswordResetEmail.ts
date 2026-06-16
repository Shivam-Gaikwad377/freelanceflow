import {resend} from "@/lib/resend";
import ApiResponse from "@/types/ApiResponse";
import PasswordResetEmail from "../../emails/Password-resetEmail";

export async function sendPasswordResetEmail(email: string, name: string, verificationToken: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Reset your password",
            react: PasswordResetEmail({ verificationCode: verificationToken })
        });
        return {
            success: true,
            message: "Password reset email sent successfully"
        };
    }

    catch (error) {
        console.error("Error sending password reset email:", error);
        return {
            success: false,
            message: "Failed to send password reset email",
        };
    }
}

