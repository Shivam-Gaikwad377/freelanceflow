import { getServerSession } from "next-auth";
import {authOptions} from "../../auth/[...nextauth]/options";
import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/dbConfig";
import User from "@/models/user.model";
import { updateUserSchema } from "@/schemas/updateUser.schema";
import ApiResponse from "@/types/ApiResponse";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parseResult = updateUserSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, message: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const updated = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: parseResult.data },
      { new: true }
    ).select("-passwordHash");

    if (!updated) {
        const response: ApiResponse = {
            success: false,
            message: "User not found",
        };
      return NextResponse.json(response, { status: 404 });
    }
    const response: ApiResponse = {
        success: true,
        message: "Profile updated successfully",
        data: updated
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    const response: ApiResponse = {
        success: false,
        message: "An error occurred while updating profile",
    };
    return NextResponse.json(response, { status: 500 });
  }
}