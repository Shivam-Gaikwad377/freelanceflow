// // app/api/user/avatar/route.ts
// import { NextRequest, NextResponse } from "next/server"
// import { upload } from "@imagekit/next"
// import { getUploadAuthParams } from "@imagekit/next/server"
// import { connectToDatabase } from "@/lib/dbConfig"
// import User from "@/models/user.model"
// // your JWT util

// export async function PATCH(req: NextRequest) {
//   const formData = await req.formData()
//   const file = formData.get("avatar") as File
//   if (!file) return NextResponse.json({ message: "No file" }, { status: 400 })

//   // 1. Upload to ImageKit
//   const { token, expire, signature } = getUploadAuthParams({
//     privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
//     publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
//   })

//   const result = await upload({
//     file,
//     fileName: file.name,
//     folder: "/avatars",
//     useUniqueFileName: true,
//     token, expire, signature,
//     publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
//   })

//   // 2. Save URL to MongoDB
//   await connectToDatabase()
//   const userId = getUserFromToken(req) // get userId from JWT

//   const user = await User.findByIdAndUpdate(
//     userId,
//     {
//       avatar: result.url,
//       avatarFileId: result.fileId, // store this to delete old avatar later
//     },
//     { new: true }
//   )

//   return NextResponse.json({ avatar: user.avatar })
// }