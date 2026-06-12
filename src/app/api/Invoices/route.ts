import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";
import { NextResponse } from "next/server";
import Invoice from "@/models/invoice.model";
import { createInvoiceSchema } from "@/schemas/createInvoice.schema";
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

    const { projectId, dueDate, status, lineItems, client } =
      await request.json();
    const parseResult = createInvoiceSchema.safeParse({
      projectId,
      dueDate,
      status,
      lineItems,
      client,
    });

    if (!parseResult.success) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invalid invoice data" },
        { status: 400 }
      );
    }
    const amount = parseResult.data.lineItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const newInvoice = new Invoice({
      ...parseResult.data,
      owner: ownerID,
      amount,
    });
    await newInvoice.save();

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Invoice created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while creating the invoice",
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

    const [invoices, total] = await Promise.all([
      Invoice.find({ owner: ownerID })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      Invoice.countDocuments({ owner: ownerID }),
    ]);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Invoices retrieved successfully",
        data: { invoices, total, offset, limit },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, message: "An error occurred while fetching invoices" },
      { status: 500 }
    );
  }
}
