import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import TimeLog  from "@/models/timeLog.model";
import { connectToDatabase } from "@/lib/dbConfig";
import { createTimeLogSchema } from "@/schemas/createTimeLog.schema";
import ApiResponse from "@/types/ApiResponse";
import mongoose from "mongoose";

import  Project  from "@/models/project.model";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { projectId } = await request.json(); // startTime dropped — server stamps it
    const validatedData = createTimeLogSchema.parse({
      userId: session.user._id,
      projectId,
      startTime: new Date(),
    });

    await connectToDatabase();

    const existingProject = await Project.findOne({
      _id: new mongoose.Types.ObjectId(validatedData.projectId),
      userId: new mongoose.Types.ObjectId(session.user._id),
    });
    if (!existingProject) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    const existingActiveTimeLog = await TimeLog.findOne({
      userId: new mongoose.Types.ObjectId(session.user._id),
      status: "active",
    }).populate("projectId", "title");

    let autoStoppedTimeLog = false;
    if (existingActiveTimeLog) {
      existingActiveTimeLog.endTime = new Date();
      existingActiveTimeLog.duration = Math.floor(
        (existingActiveTimeLog.endTime.getTime() -
          existingActiveTimeLog.startTime.getTime()) / 1000
      );
      existingActiveTimeLog.status = "completed";
      await existingActiveTimeLog.save(); // ✅ actually persist the stop
      autoStoppedTimeLog = true;
    }

    const newTimeLog = await TimeLog.create({ // ✅ await it
      userId: new mongoose.Types.ObjectId(validatedData.userId),
      projectId: new mongoose.Types.ObjectId(validatedData.projectId),
      startTime: validatedData.startTime,
      status: "active",
      source: "stopwatch",
    });

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Time log started successfully",
        data: { timeLog: newTimeLog, autoStoppedTimeLog },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error starting time log:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Failed to start time log" },
      { status: 500 }
    );
  }
}