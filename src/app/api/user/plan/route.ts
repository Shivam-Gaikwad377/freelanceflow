import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConfig";
import User from "@/models/user.model";
import { updateUserSchema } from "@/schemas/updateUser.schema";
import ApiResponse from "@/types/ApiResponse";
import mongoose from "mongoose";


export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // if(session.user?.plan === "premium") {
    //   return NextResponse.json<ApiResponse>(
    //     { success: false, message: "You are already on the premium plan." },
    //     { status: 400 }
    //   );
    // }
    const newPlan = session.user?.plan === "premium" ? "free" : "premium";
    
    await connectToDatabase();
    const updated = await User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(session?.user?._id) },
      { $set: { plan: newPlan } },
      { new: true }
    ).select("-password");

    if (!updated) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Profile updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);

    return NextResponse.json<ApiResponse>(
      { success: false, message: "An error occurred while updating profile" },
      { status: 500 }
    );
  }
}