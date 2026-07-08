import { z } from "zod";
import mongoose from "mongoose";

export interface IClient  extends mongoose.Document  {

    name: string;
    email: string;
    phone: string;
    company: string;
    status: "active" | "inactive";
    userId: mongoose.Types.ObjectId;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    totalBilled?: number;
    
}

export const createClientSchema = z.object({
    name: z.string().min(1, "Name is required"),    
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    company: z.string().min(1, "Company name is required"),
    status: z.enum(["active", "inactive"]),
    description: z.string().optional(),
});

export type CreateClientInput = z.input<typeof createClientSchema>;
export type CreateClientOutput = z.output<typeof createClientSchema>;