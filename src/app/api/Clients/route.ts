import User from "@/models/user.model";
import { connectToDatabase } from "@/lib/dbConfig";
import ApiResponse from "@/types/ApiResponse";
import { NextResponse } from "next/server";
import Client from "@/models/client.model";
import { createClientSchema } from "@/schemas/createClient.schema";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    try{
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

        const { name, email, company, phone, status } = await request.json();

        const parseResult = createClientSchema.safeParse({
            name,
            email,
            company,
            phone,
            status,
        });

        if (!parseResult.success) {
            
            return NextResponse.json<ApiResponse>({ success: false, message: "Invalid client data" }, { status: 400 });
        }

        const newClient = new Client({
            ...parseResult.data,
            owner: ownerID
        });

        await newClient.save();

        
        return NextResponse.json<ApiResponse>({ success: true, message: "Client created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating client:", error);
        return NextResponse.json<ApiResponse>({ success: false, message: "An error occurred while creating the client" }, { status: 500 });
    }
}

