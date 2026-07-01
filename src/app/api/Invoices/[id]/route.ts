import { NextResponse } from "next/server";
import Invoice from "@/models/invoice.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { isValidObjectId } from "mongoose";
import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";
import { updateInvoiceSchema } from "@/schemas/updateInvoice.schema";
import { markOverdueInvoices } from "@/helpers/markOverdues";

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

    const invoice = await Invoice.findOne({
      _id: id,
      userId: session.user._id,
    }).lean();
    

    if (!invoice) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invoice not found" },
        { status: 404 }
      );
    }
    await markOverdueInvoices(session.user._id);

    return NextResponse.json<ApiResponse>(
      { success: true, message: "Invoice fetched successfully", data: invoice },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while fetching the invoice",
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
        { success: false, message: "Invalid invoice ID" },
        { status: 400 }
      );
    }

    const requestBody = await request.json();
    const validation = updateInvoiceSchema.safeParse(requestBody);
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
    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: id, userId: session.user._id },
      { $set: validation.data },
      { new: true }
    ).lean();
    if (!updatedInvoice) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invoice not found or not owned by user" },
        { status: 404 }
      );
    }
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Invoice updated successfully",
        data: updatedInvoice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while updating the invoice",
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

    // if (!isValidObjectId(id)) {
    //   return NextResponse.json<ApiResponse>(
    //     { success: false, message: "Invalid invoice ID" },
    //     { status: 400 }
    //   );
    // }

    await connectToDatabase();
    const requestBody = await request.json();
    const validation = updateInvoiceSchema.safeParse(requestBody);
    if (!validation.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: validation.error.issues.length > 0
            ? validation.error.issues[0].message
            : "Invalid request data",
          data: validation.error.issues,
        },
        { status: 401 }
      );
    }
    const amount = validation?.data?.lineItems?.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: id, userId: session.user._id },
      { $set: { ...validation.data, amount } },
      { new: true }
    ).lean();
    if (!updatedInvoice) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invoice not found or not owned by user" },
        { status: 404 }
      );
    }
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Invoice updated successfully",
        data: updatedInvoice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while updating the invoice",
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
        { success: false, message: "Invalid invoice ID" },
        { status: 400 }
      );
    }
    await connectToDatabase();
    const deleted = await Invoice.findOneAndDelete({
      _id: id,
      userId: session.user._id,
    });
    if (!deleted) {
      return NextResponse.json<ApiResponse>(
        { success: false, message: "Invoice not found or not owned by user" },
        { status: 404 }
      );
    }
    return NextResponse.json<ApiResponse>(
      { success: true, message: "Invoice deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "An error occurred while deleting the invoice",
      },
      { status: 500 }
    );
  }
}
