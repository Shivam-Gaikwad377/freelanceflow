import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import TimeLog from "@/models/timeLog.model";
import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";
import mongoose, { isValidObjectId } from "mongoose";
import { updateTimeLogSchema } from "@/schemas/updateTimeLog.schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
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

    const deletedLog = await TimeLog.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(session.user._id),
    });

    if (!deletedLog) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Time log not found" },
        { status: 404 }
      );
    }
    return NextResponse.json<ApiResponse>(
      { success: true, message: "Time log deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting time log:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while deleting the time log",
      },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();
    const validatedData = updateTimeLogSchema.parse(body);

    const Log = await TimeLog.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(session.user._id),
      source: "manual", // only this route touches manual entries
    });
    if (!Log) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Time log not found" },
        { status: 404 }
      );
    }

    // Merge FIRST, then validate the merged result — not just the incoming fields
    const finalStartTime = validatedData.startTime ?? Log.startTime;
    const finalEndTime = validatedData.endTime ?? Log.endTime;

    if (!finalEndTime) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Manual entries require an end time" },
        { status: 400 }
      );
    }

    if (finalEndTime.getTime() <= finalStartTime.getTime()) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "endTime must be after startTime" },
        { status: 400 }
      );
    }

    const duration = Math.floor(
      (finalEndTime.getTime() - finalStartTime.getTime()) / 1000
    );

    Log.startTime = finalStartTime;
    Log.endTime = finalEndTime;
    Log.duration = duration; // local var — never written back onto validatedData
    Log.status = validatedData.status ?? Log.status;
    if (validatedData.projectId) {
      Log.projectId = new mongoose.Types.ObjectId(validatedData.projectId);
    }

    const updatedLog = await Log.save();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Time log updated successfully",
        data: updatedLog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating time log:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while updating the time log",
      },
      { status: 500 }
    );
  }
}
