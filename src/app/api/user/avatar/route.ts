// app/api/user/avatar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { upload } from "@imagekit/next";
import { getUploadAuthParams } from "@imagekit/next/server";
import { connectToDatabase } from "@/lib/dbConfig";
import User from "@/models/user.model";
import { getToken } from "next-auth/jwt";
import imagekit from "imagekit";
import ApiResponse from "@/types/ApiResponse";

const imagekitClient = new imagekit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function PATCH(req: NextRequest) {
  // 1. Authenticate user
  const jwttoken = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!jwttoken) {
    const response: ApiResponse = {
      success: false,
      message: "Unauthorized",
      statusCode: 401,
    };
    return NextResponse.json(response, { status: response.statusCode });
  }
  const userId = jwttoken?._id;

  //2. get the file from the request
  const formData = await req.formData();
  const file = formData.get("avatar") as File;
  if (!file) {
    const response: ApiResponse = {
      success: false,
      message: "No file",
      statusCode: 400,
    };
    return NextResponse.json(response, { status: response.statusCode });
  }

  // 3. Delete old avatar from ImageKit if exists
  await connectToDatabase();
  const existingUser = await User.findById(userId);
  if (existingUser?.avatar?.avatarFileId) {
    await imagekitClient.deleteFile(existingUser.avatar.avatarFileId);
  }

  // 3. Upload to ImageKit
  const { token, expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  });

  const result = await upload({
    file,
    fileName: file.name,
    folder: "/avatars",
    useUniqueFileName: true,
    token,
    expire,
    signature,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  });

  // 3. Save URL to MongoDB

  const user = await User.findByIdAndUpdate(
    userId,
    {
      avatar: {
        avatarUrl: result.url,
        avatarFileId: result.fileId, // store this to delete old avatar later
      },
    },
    { new: true }
  );
  if (!user) {
    const response: ApiResponse = {
      success: false,
      message: "User not found",
      statusCode: 404,
    };
    return NextResponse.json(response, { status: response.statusCode });
  }
  const response: ApiResponse = {
    success: true,
    message: "Avatar updated successfully",
    data: { avatar: user.avatar },
    statusCode: 200,
  };
  return NextResponse.json(response, { status: response.statusCode });
}
