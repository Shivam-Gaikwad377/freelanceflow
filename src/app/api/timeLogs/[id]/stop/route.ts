import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/options";
import TimeLog from "@/models/timeLog.model";
import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";
import mongoose, { isValidObjectId } from "mongoose";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const id = (await params).id;
    if (!isValidObjectId(id)) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid time log ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Step 1: fetch the log to get startTime (needed to compute duration)
    const runningLog = await TimeLog.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(session.user._id),
      status: "active",
    });

    if (!runningLog) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Time log not found or already stopped" },
        { status: 404 }
      );
    }

    const endTime = new Date();
    const duration = Math.floor(
      (endTime.getTime() - runningLog.startTime.getTime()) / 1000
    );

    // Step 2: atomic update, re-checking status guards against a double-stop race
    const stoppedLog = await TimeLog.findOneAndUpdate(
      { _id: runningLog._id, status: "active" },
      { $set: { endTime, duration, status: "completed" } },
      { new: true }
    );

    if (!stoppedLog) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Time log already stopped" },
        { status: 409 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Time log stopped successfully",
        data: stoppedLog, // ✅ frontend gets duration + endTime
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error stopping time log:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "An error occurred while stopping the time log" },
      { status: 500 }
    );
  }
}