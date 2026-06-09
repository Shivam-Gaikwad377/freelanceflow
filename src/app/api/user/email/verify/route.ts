import { connectToDatabase } from "@/lib/dbConfig";
import User from "@/models/user.model";
import  ApiResponse from "@/types/ApiResponse";
import { emailSchema } from "@/schemas/email.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            const response: ApiResponse = {
                success: false,
                message: "Unauthorized",
            };
            return NextResponse.json(response, { status: 401 });
        }
        
        
        await connectToDatabase();
        const user = await User.findById(session.user._id);
        if(!user) {
            const response: ApiResponse = {
                success: false,
                message: "User not found",
            };
            return NextResponse.json(response, { status: 404 });
        }
        if (!user.pendingEmail) {
            const response: ApiResponse = {
                success: false,
                message: "No pending email change request found",
            };
            return NextResponse.json(response, { status: 400 });
        }
        const { verificationToken } = await request.json();
        const isOtpValid = user.verificationToken === verificationToken && user.ExpiresAt && user.ExpiresAt > new Date();

        if(!isOtpValid) {
            const response: ApiResponse = {
                success: false,
                message: "Invalid or expired verification token",
            };
            return NextResponse.json(response, { status: 400 });
        }
        
        user.verificationToken = undefined;
        user.ExpiresAt = undefined;
        user.email = user.pendingEmail;
        user.pendingEmail = undefined;
        await user.save();
        const response: ApiResponse = {
            success: true,
            message: "Email verified successfully",
        };
        return NextResponse.json(response, { status: 200 });
        
        
    }catch (error) {
        console.error("Error verifying email:", error);
        const response: ApiResponse = {
            success: false,
            message: "An error occurred while verifying email",
        };
        return NextResponse.json(response, { status: 500 });
    }
}