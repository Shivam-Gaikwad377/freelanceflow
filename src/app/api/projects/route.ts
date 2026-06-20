import User from "@/models/user.model";
import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";
import { NextResponse } from "next/server";
import Project from "@/models/project.model";
import { projectSchema } from "@/schemas/project.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import Client from "@/models/client.model";
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

    const { title, description, client, clientID, budget, deadline, status } =
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
      Owner: ownerID,
      clientID: clientID,
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
    const searchBy = searchParams.get("searchBy") || "title";

    const filter: any = { Owner: ownerID };

    if (search) {
      if (searchBy === "title") {
        filter.title = { $regex: search, $options: "i" };
      }
      // NEW: Explicitly handle searching by an exact Client ID
      else if (searchBy === "clientId") {
        filter.clientID = search;
      }
      // OPTIONAL: Keep your old logic under a new name if you have a search bar that searches clients by name
      else if (searchBy === "clientName") {
        const matchingClients = await Client.find({
          name: { $regex: search, $options: "i" },
          userId: ownerID,
        }).select("_id");

        filter.clientID = { $in: matchingClients.map((c) => c._id) };
      }
    }

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
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
