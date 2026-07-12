import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";
import { NextResponse } from "next/server";
import Project from "@/models/project.model";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { createTaskSchema } from "@/schemas/createTask.schema";
import Task from "@/models/task.model";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const ownerID = session?.user?._id;
    if (!ownerID || !session) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }
    await connectToDatabase();

    const { projectId, title, priority, dueDate, status } =
      await request.json();
    const parseResult = createTaskSchema.safeParse({
      userId: ownerID,
      projectId,
      title,
      priority,
      dueDate,
      status,
    });
    const project = await Project.findOne({
      _id: new mongoose.Types.ObjectId(projectId),
      userId: new mongoose.Types.ObjectId(ownerID),
    });
    if (!project) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message:
            "Project not found or you do not have permission to add tasks to this project",
        },
        { status: 404 }
      );
    }

    if (!parseResult.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid task data" },
        { status: 400 }
      );
    }

    const newTask = new Task({ ...parseResult.data });
    await newTask.save();

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Task created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while creating the task",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const ownerID = session?.user?._id;
    if (!ownerID || !session) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") === "asc" ? 1 : -1;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status") || "all";
    const priority = searchParams.get("priority") || "all";
    const dueDate = searchParams.get("dueDate") || "all";
    const search = searchParams.get("search") || "";
    const searchBy = searchParams.get("searchBy") || "title";

    const offset = Math.max(
      0,
      parseInt(searchParams.get("offset") ?? "0", 10) || 0
    );
    const limit = Math.min(
      50,
      parseInt(searchParams.get("limit") ?? "10", 10) || 10
    );

    const filter: any = {
      userId: new mongoose.Types.ObjectId(ownerID),
    };
    if (projectId) {
      filter.projectId = new mongoose.Types.ObjectId(projectId);
    }
    if (status !== "all" && status) {
      filter.status = status;
    }
    if (priority !== "all" && priority) {
      filter.priority = priority;
    }
    if (search) {
      if (searchBy === "title") {
        filter.title = { $regex: search, $options: "i" };
      }
    }
    //update overdue tasks before fetching
    const currentDate = new Date();
    await Task.updateMany(
      {
        userId: new mongoose.Types.ObjectId(ownerID),
        dueDate: { $lt: currentDate },
        status: { $nin: ["completed", "overdue"] },
      },
      { $set: { status: "overdue" } }
    );

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort({ [sortBy]: sort })
        .skip(offset)
        .limit(limit)
        .populate("projectId", "name"),
      Task.countDocuments(filter),
    ]);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Tasks fetched successfully",
        data: {
          tasks,
          total,
          offset,
          limit,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while fetching tasks",
      },
      { status: 500 }
    );
  }
}
