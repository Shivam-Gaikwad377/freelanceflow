import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";
import { NextResponse } from "next/server";
import Project from "@/models/project.model";

import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { isValidObjectId } from "mongoose";
import { updateProjectSchema } from "@/schemas/updateProject.schema";

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
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const project = await Project.findOne({
      _id: id,
      userId: session.user._id,
    }).lean();

    if (!project) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Project fetched successfully", data: project },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while fetching the project",
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
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const deleted = await Project.findOneAndDelete({
      _id: id,
      userId: session.user._id,
    });
    if (!deleted) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Project not found or not owned by user" },
        { status: 404 }
      );
    }
    return NextResponse.json<ApiResponse>(
      { success: true, message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while deleting the project",
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
        { success: false, message: "Invalid client ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const requestBody = await request.json();
    const validation = updateProjectSchema.safeParse(requestBody);
    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid request data",
          data: validation.error.issues,
        },
        { status: 400 }
      );
    }
    const updatedProject = await Project.findOneAndUpdate(
      { _id: id, userId: session.user._id },
      { $set: validation.data },
      { new: true }
    ).lean();
    if (!updatedProject) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Project not found or not owned by user" },
        { status: 404 }
      );
    }
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Project updated successfully",
        data: updatedProject,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while updating the project",
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
        { success: false, message: "Invalid project ID" },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const body = await request.json();
    const parseResult = updateProjectSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid project data" },
        { status: 400 }
      );
    }
    const updated = await Project.findOneAndUpdate(
      { _id: id, userId: session.user._id },
      { $set: parseResult.data },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Project not found or not owned by user" },
        { status: 404 }
      );
    }
    return NextResponse.json<ApiResponse>(
      { success: true, message: "Project updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while updating the project",
      },
      { status: 500 }
    );
  }
}
