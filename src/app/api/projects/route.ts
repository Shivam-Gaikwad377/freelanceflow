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

    const { title, description, client, budget, deadline, status } =
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
      title,
      description,
      client,
      budget,
      deadline,
      status,
      owner: ownerID,
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
