import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";
import { NextResponse } from "next/server";
import Project from "@/models/project.model";
import { projectSchema } from "@/schemas/project.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { BurnRateCalculationPipeline } from "@/lib/pipelines/project.pipeline";
import { Types } from "mongoose";
export async function POST(request: Request) {
  try {
    await connectToDatabase();
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

    const { title, description, client, clientId, budget, deadline, status } =
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
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid project data",
        },
        { status: 400 }
      );
    }

    const newProject = new Project({
      ...parseResult.data,
      userId: ownerID,
      clientId: clientId,
    });

    await newProject.save();

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Project created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);

    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while creating the project",
      },
      { status: 500 }
    );
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

    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const clientId = searchParams.get("clientId") || "";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sort = searchParams.get("sort") || "desc";
    const filter: any = { userId: new Types.ObjectId(ownerID) };
    if (status) filter.status = status;
    if (clientId) filter.clientId = new Types.ObjectId(clientId);

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const [projects, total] = await Promise.all([
      Project.aggregate([
        { $match: filter },
        ...BurnRateCalculationPipeline,
        { $sort: { [sortBy]: sort === "asc" ? 1 : -1 } },
        { $skip: offset },
        { $limit: limit },
      ]),
      Project.countDocuments(filter),
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
