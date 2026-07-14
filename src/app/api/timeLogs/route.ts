import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import TimeLog from "@/models/timeLog.model";
import { connectToDatabase } from "@/lib/dbConfig";
import { createTimeLogSchema } from "@/schemas/createTimeLog.schema";
import ApiResponse from "@/types/ApiResponse";
import mongoose from "mongoose";

import Project from "@/models/project.model";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");
    const filter: any = {
      userId: new mongoose.Types.ObjectId(session.user._id),
    };
    if (!projectId) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "projectId is required" },
        { status: 400 }
      );
    }
    //
    if (projectId) {
      filter.projectId = new mongoose.Types.ObjectId(projectId);
    }
    const offset = Math.max(
      0,
      parseInt(searchParams.get("offset") ?? "0", 10) || 0
    );
    const limit = Math.min(
      50,
      parseInt(searchParams.get("limit") ?? "10", 10) || 10
    );
    if (projectId) {
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

      const [timeLog, totalDuration, total] = await Promise.all([
        TimeLog.find(filter).sort({ startTime: -1 }).skip(offset).limit(limit),
        TimeLog.aggregate([
          {
            $match: {
              userId: new mongoose.Types.ObjectId(session.user._id),
              projectId: new mongoose.Types.ObjectId(projectId),
            },
          },
          {
            $group: {
              _id: null,
              totalDuration: { $sum: "$duration" },
            },
          },
        ]),
        TimeLog.countDocuments(filter),
      ]);

      return NextResponse.json<ApiResponse>(
        {
          success: true,
          message: "Time logs fetched successfully",
          data: {
            timeLogs: timeLog,
            totalDuration: totalDuration[0]?.totalDuration || 0,
            total: total,
          },
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching time logs:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
