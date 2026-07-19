import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";
import { NextResponse } from "next/server";
import Project from "@/models/project.model";
import { projectSchema } from "@/schemas/project.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { DueThisMonthPipeline } from "@/lib/pipelines/project.pipeline";
import { Types } from "mongoose";
import { isValidObjectId } from "mongoose";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const ownerId = session?.user?._id;
    if (!ownerId || !session) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const [result] = await Project.aggregate([
      { $match: { userId: new Types.ObjectId(ownerId) } },
      {
        $facet: {
          projects: [
            {
              $match: {
                deadline: {
                  $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                  $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
                },
                status: "in progress",
              },
            },
            { $sort: { deadline: 1 } },
          ],
          count: [
            { $match: { deadline: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1), $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1) } } },
            { $count: "count" },
          ],
        },
      },
    ]);

    const projects = result.projects; // actual docs
    const count = result.count[0]?.count ?? 0; // real count

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Projects retrieved successfully",
        data: {
          projects,
          count,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching project stats:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Failed to fetch project stats",
      },
      { status: 500 }
    );
  }
}
