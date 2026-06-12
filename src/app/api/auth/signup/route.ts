import ApiResponse from "@/types/ApiResponse";
import { sendVerificationEmail } from "@/helpers/sendVerificationemail";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/dbConfig";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const { name, email, password, bussinessName, currency } =
      await request.json();
    if (!name || !email || !password || !bussinessName || !currency) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    // 1. Check if a verified user already exists
    const existingUserVerifiedByEmail = await User.findOne({
      email,
      isVerified: true,
    });
    if (existingUserVerifiedByEmail) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message:
            "Email is already in use. Please use a different email or log in.",
        },
        { status: 400 }
      );
    }

    const existingUserUnverifiedByEmail = await User.findOne({ email });
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expirationTime = new Date(Date.now() + 10 * 60 * 1000);

    if (existingUserUnverifiedByEmail) {
      existingUserUnverifiedByEmail.name = name; // ✅ add this
      existingUserUnverifiedByEmail.password = hashedPassword;
      existingUserUnverifiedByEmail.verificationToken = verificationToken;
      existingUserUnverifiedByEmail.ExpiresAt = expirationTime;
      await existingUserUnverifiedByEmail.save();
    } else {
      // Create a brand new user
      const newUser = new User({
        name,
        email,
        bussinessName,
        currency,
        password: hashedPassword,
        verificationToken,
        ExpiresAt: expirationTime,
        isVerified: false, // Remains false until they verify
      });
      await newUser.save();
    }

    // 2. Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      name,
      verificationToken
    );
    if (!emailResponse.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message:
          "User registered successfully. Please check your email for the verification code.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error during signup:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred during signup. Please try again later.",
      },
      { status: 500 }
    );
  }
}
