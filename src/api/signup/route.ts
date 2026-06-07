import ApiResponse from '@/types/ApiResponse';
import { sendVerificationEmail } from '@/helpers/sendVerificationemail';
import bcrypt from 'bcryptjs';
import {connectToDatabase} from '@/lib/dbConfig';
import User from '@/models/user.model';

export async function POST(request: Request) {
    await connectToDatabase();
    try {
        const { name, email, password } = await request.json();
        
        // 1. Check if a verified user already exists
        const existingUserVerifiedByEmail = await User.findOne({ email, isVerified: true });
        if(existingUserVerifiedByEmail) {
            const response: ApiResponse = {
                success: false,
                message: "Email is already in use. Please use a different email or log in."
            };
            return Response.json(response, { status: 400 });
        }

        const existingUserUnverifiedByEmail = await User.findOne({ email });
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

        if(existingUserUnverifiedByEmail) {
            // Update the existing unverified user with new details
            existingUserUnverifiedByEmail.password = hashedPassword;
            existingUserUnverifiedByEmail.verificationToken = verificationToken;
            existingUserUnverifiedByEmail.ExpiresAt = expirationTime;
            await existingUserUnverifiedByEmail.save(); 
        } else {
            // Create a brand new user
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                verificationToken,
                ExpiresAt: expirationTime,
                isVerified: false, // Remains false until they verify
            });
            await newUser.save();
        }

        // 2. Send verification email
        const emailResponse = await sendVerificationEmail(email, name, verificationToken);
        if(!emailResponse.success) {
            const response: ApiResponse = {
                success: false,
                message: emailResponse.message
            };
            return Response.json(response, { status: 500 });
        }

        const response: ApiResponse = {
            success: true,
            message: "User registered successfully. Please check your email for the verification code."
        };
        return Response.json(response, { status: 201 });

    } catch (error) {
        console.log("Error during signup:", error);
        const response: ApiResponse = {
            success: false,
            message: "An error occurred during signup. Please try again later."
        };
        return Response.json(response, { status: 500 });
    }
}