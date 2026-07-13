import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import TimeLog from "@/models/timeLog.model";
import { connectToDatabase } from "@/lib/dbConfig";
import { manualTimeLogSchema } from "@/schemas/manualTimeLog.schema";
import ApiResponse from "@/types/ApiResponse";
import mongoose from "mongoose";
import Project from "@/models/project.model";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const { projectId, startTime, endTime } = await request.json();

    await connectToDatabase();
    const existingProject = await Project.findOne({
      _id: new mongoose.Types.ObjectId(projectId),
      userId: new mongoose.Types.ObjectId(session.user._id),
    });
    if (!existingProject) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    const validatedData = manualTimeLogSchema.parse({
      userId: session.user._id,
      projectId,
      startTime,
      endTime,
    });

    const durationInSeconds = Math.floor(
      (validatedData.endTime.getTime() - validatedData.startTime.getTime()) / 1000
    );

    const newTimeLog = await TimeLog.create({
      userId: new mongoose.Types.ObjectId(validatedData.userId),
      projectId: new mongoose.Types.ObjectId(validatedData.projectId),
      startTime: validatedData.startTime,
      endTime: validatedData.endTime,
      status: "completed",
      source: "manual",
      duration: durationInSeconds,
    });

   
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Time log created successfully",
        data: newTimeLog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating time log:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while creating the time log",
      },
      { status: 500 }
    );
  }
}
