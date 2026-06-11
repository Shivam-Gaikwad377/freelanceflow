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
            const response: ApiResponse = {
                success: false,
                message: "Unauthorized",
            };
            return NextResponse.json(response, { status: 401 });
        }
        await connectToDatabase();

        const { projectId, amount, dueDate, status, lineItems, client } = await request.json();
        const parseResult = createInvoiceSchema.safeParse({
            projectId,
            amount,
            dueDate,
            status,
            lineItems,
            client,
        });

        if (!parseResult.success) {
            return NextResponse.json<ApiResponse>({ success: false, message: "Invalid invoice data" }, { status: 400 });
        }
        const newInvoice = new Invoice({
            ...parseResult.data,
            client: ownerID,
        });
        await newInvoice.save();

        return NextResponse.json<ApiResponse>({ success: true, message: "Invoice created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating invoice:", error);
        return NextResponse.json<ApiResponse>({ success: false, message: "An error occurred while creating the invoice" }, { status: 500 });
    }
}