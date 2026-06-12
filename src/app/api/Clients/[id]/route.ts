import { NextResponse } from "next/server";
import Client from "@/models/client.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";
import { updateClientSchema } from "@/schemas/updateClient.schema";

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
        { success: false, message: "Invalid client ID" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const client = await Client.findOne({
      _id: id,
      Owner: session.user._id,
    }).lean();

    if (!client) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Client not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Client fetched successfully", data: client },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while fetching the client",
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
        { success: false, message: "Invalid client ID" },
        { status: 400 }
      );
    }

    const requestBody = await request.json();
    const validation = updateClientSchema.safeParse(requestBody);
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

    await connectToDatabase();
    const updatedClient = await Client.findOneAndUpdate(
      { _id: id, userId: session.user._id },
      { $set: validation.data },
      { new: true }
    ).lean();
    if (!updatedClient) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Client not found or not owned by user" },
        { status: 404 }
      );
    }
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Client updated successfully",
        data: updatedClient,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while updating the client",
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
    const validation = updateClientSchema.safeParse(requestBody);
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
    const updatedClient = await Client.findOneAndUpdate(
      { _id: id, userId: session.user._id },
      { $set: validation.data },
      { new: true }
    ).lean();
    if (!updatedClient) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Client not found or not owned by user" },
        { status: 404 }
      );
    }
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Client updated successfully",
        data: updatedClient,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while updating the client",
      },
      { status: 500 }
    );
  }
}
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
        { success: false, message: "Invalid client ID" },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const deleted = await Client.findOneAndDelete({
      _id: id,
      userId: session.user._id,
    });
    if (!deleted) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Client not found or not owned by user" },
        { status: 404 }
      );
    }
    return NextResponse.json<ApiResponse>(
      { success: true, message: "Client deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while deleting the client",
      },
      { status: 500 }
    );
  }
}


