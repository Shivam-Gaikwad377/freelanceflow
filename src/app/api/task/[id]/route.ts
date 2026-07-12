import mongoose from "mongoose";
import Task from "@/models/task.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import ApiResponse from "@/types/ApiResponse";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConfig";
import { isValidObjectId } from "mongoose";
import { updateTaskSchema } from "@/schemas/updateTask.schema";
type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteContext) {
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
        { success: false, message: "Invalid task ID" },
        { status: 400 }
      );
    }
    await connectToDatabase();

    const task = await Task.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(session.user._id),
    })
      .lean()
      .populate("projectId", "title ");

    if (!task) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }
    //mark overdue tasks if the due date has passed and the status is still pending
    if (task.status === "pending" && task.dueDate < new Date()) {
      task.status = "overdue";
      await Task.updateOne(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: { status: "overdue" } }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Task fetched successfully", data: task },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching task:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while fetching the task",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
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
        { success: false, message: "Invalid task ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const requestBody = await request.json();
    const parseResult = updateTaskSchema.safeParse(requestBody);
    if (!parseResult.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }
    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(session.user._id),
      },
      { $set: parseResult.data },
      { new: true }
    )
      .lean()
      .populate("projectId", "title ");

    if (!updatedTask) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message:
            "Task not found or you do not have permission to update this task",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Task updated successfully",
        data: updatedTask,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while updating the task",
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
        { success: false, message: "Invalid task ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const requestBody = await request.json();
    const parseResult = updateTaskSchema.safeParse(requestBody);
    if (!parseResult.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }

    const updatedTask = await Task.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(id),
        userId: new mongoose.Types.ObjectId(session.user._id),
      },
      { $set: parseResult.data },
      { new: true }
    )
      .lean()
      .populate("projectId", "title ");

    if (!updatedTask) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message:
            "Task not found or you do not have permission to update this task",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Task updated successfully",
        data: updatedTask,
      },
      { status: 200 }
    );
  } catch (error) {
    

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while updating the task",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
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
        { success: false, message: "Invalid task ID" },
        { status: 400 }
      );
    }
    await connectToDatabase();

    const deletedTask = await Task.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(session.user._id),
    });
    if (!deletedTask) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message:
            "Task not found or you do not have permission to delete this task",
        },
        { status: 404 }
      );
    }
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Task deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while deleting the task",
      },
      { status: 500 }
    );
  }
}
