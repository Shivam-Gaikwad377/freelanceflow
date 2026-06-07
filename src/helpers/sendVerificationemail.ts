import {resend} from "@/lib/resend";
import ApiResponse from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerficationEmail";

export async function sendVerificationEmail(email: string, name: string, verificationToken: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: "FreelanceFlow <no-reply@freelanceflow.com>",
            to: email,
            subject: "Verify your email address",
            react: VerificationEmail({ verificationCode: verificationToken })
        });
        return {
            success: true,
            message: "Verification email sent successfully"
        };
    }

    catch (error) {
        console.error("Error sending verification email:", error);
        return {
            success: false,
            message: "Failed to send verification email",
        };
    }
}

