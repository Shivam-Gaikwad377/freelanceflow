import User from "@/models/user.model";
import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";
import { NextResponse } from "next/server";
import Client from "@/models/client.model";
import { createClientSchema } from "@/schemas/createClient.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

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

    const { name, email, company, phone, status } = await request.json();

    const parseResult = createClientSchema.safeParse({
      name,
      email,
      company,
      phone,
      status,
    });

    if (!parseResult.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid client data" },
        { status: 400 }
      );
    }

    const newClient = new Client({
      ...parseResult.data,
      userId: ownerID,
    });

    await newClient.save();

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Client created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while creating the client",
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

    const sort = searchParams.get("sort") === "asc" ? 1 : -1;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const search = searchParams.get("search") || "";
    
    const filter: any = { userId: ownerID };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
      ];
    }

    const [Clients, total] = await Promise.all([
      Client.find(filter)
        .sort({ [sortBy]: sort })
        .skip(offset)
        .limit(limit)
        .lean(),
      Client.countDocuments(filter),
    ]);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Clients retrieved successfully",
        data: { clients: Clients, total, offset, limit },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "An error occurred while fetching clients" },
      { status: 500 }
    );
  }
}
