// app/api/user/avatar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConfig";
import User from "@/models/user.model";
import { getToken } from "next-auth/jwt";
import ImageKit from "imagekit"; // Fixed casing casing conventions
import ApiResponse from "@/types/ApiResponse";
import formData from "form-data"; // Import form-data for handling multipart/form-data requests

// Initialize ImageKit Client
const imagekitClient = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function PATCH(req: NextRequest) {
  try {
    // 1. Authenticate user
    const jwttoken = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (!jwttoken) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const userId = jwttoken?._id;

    // 2. Get the file from the request
    const uploadData = await req.formData();
    const file = uploadData.get("avatar") ;
    if ( typeof file === "string" || !file) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 3. Delete old avatar from ImageKit if it exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (existingUser?.avatar?.avatarFileId) {
      try {
        await imagekitClient.deleteFile(existingUser.avatar.avatarFileId);
      } catch (deleteError) {
        // Log the error but don't halt execution if the file is already gone
        console.error(
          "Failed to delete old avatar from ImageKit:",
          deleteError
        );
      }
    }

    const buffer = Buffer.from(await (file as any).arrayBuffer());
    

    // 5. Upload to ImageKit
    const result = await imagekitClient.upload({
      file: buffer,
      fileName: (file as any).name || "avatar",
      folder: "/avatars",
      useUniqueFileName: true,
    });

    // 6. Save URL to MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        avatar: {
          avatarUrl: result.url,
          avatarFileId: result.fileId,
        },
      },
      { new: true }
    );
    

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Avatar updated successfully",
        data: { avatar: updatedUser!.avatar },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating avatar:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: error.message || "An error occurred while updating the avatar",
      },
      { status: 500 }
    );
  }
}
