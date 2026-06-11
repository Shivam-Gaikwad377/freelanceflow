import User from "@/models/user.model";
import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";
import { NextResponse } from "next/server";
import Project from "@/models/project.model";
import { projectSchema } from "@/schemas/project.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const session = await getServerSession(authOptions);
    const ownerID = session?.user?._id;
    if (!ownerID || !session) {
      const response: ApiResponse = {
        success: false,
        message: "Unauthorized",
      };
      return NextResponse.json(response, { status: 401 });
    }
    const { title, description,client, budget, deadline, status } =
      await request.json();

    const parseResult = projectSchema.safeParse({
      title,
      description,
      client,
      budget,
      deadline,
      status,
    });

    if (!parseResult.success) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid project data",
      };
      return NextResponse.json(response, { status: 400 });
    }

    const newProject = new Project({
      ...parseResult.data,
      Owner: ownerID,
    });

    await newProject.save();
    const response: ApiResponse = {
      success: true,
      message: "Project created successfully",
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    const response: ApiResponse = {
      success: false,
      message: "An error occurred while creating the project",
    };
    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const ownerID = session?.user?._id;

    if (!session || !ownerID) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const offset = Math.max(
      0,
      parseInt(searchParams.get("offset") ?? "0", 10) || 0
    );
    const limit = Math.min(
      50,
      parseInt(searchParams.get("limit") ?? "10", 10) || 10
    );

    const [projects, total] = await Promise.all([
      Project.find({ Owner: ownerID })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      Project.countDocuments({ Owner: ownerID }),
    ]);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Projects retrieved successfully",
        data: { projects, total, offset, limit },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "An error occurred while fetching projects" },
      { status: 500 }
    );
  }
}
