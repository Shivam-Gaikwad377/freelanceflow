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
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parseResult = updateUserSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid user data" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const updated = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: parseResult.data },
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

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const user = await User.findById({ _id: session.user._id }).select("-password -verificationToken -ExpiresAt" );
    if (!user) {
        return NextResponse.json<ApiResponse>(
          { success: false, message: "User not found" },
          { status: 404 }
        );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Profile fetched successfully", data: user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching profile:", error);
    
    return NextResponse.json<ApiResponse>(
      { success: false, message: "An error occurred while fetching profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    //TODO: Also delete all projects associated with this user
    // await Project.deleteMany({ owner: session.user._id });
    // await CLient.deleteMany({ owner: session.user._id });
    // await Invoices.deleteMany({ owner: session.user._id });
    const deleted = await User.findOneAndDelete({ _id: session.user._id });
    if (!deleted) {
        
      return NextResponse.json<ApiResponse>(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Profile deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting profile:", error);
    
    return NextResponse.json<ApiResponse>(
      { success: false, message: "An error occurred while deleting profile" },
      { status: 500 }
    );
  }
}