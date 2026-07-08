import {z} from "zod";
import { Document } from "mongoose";
export interface IProject extends Document {
    title: string;
    description: string;
    budget: number;
    deadline: Date;
    status: "open" | "in progress" | "completed";
    clientId?: string;
    client: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string; 
    StartedAt?: Date;
}

export const projectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    budget: z.number().positive("Budget must be a positive number"),
    deadline: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
    status: z.enum(["open", "in progress", "completed"]),
    clientId: z.string().min(1, "Client ID is required").optional(),
    client: z.string().min(1, "Client name is required"),
    
})

export type ProjectInput = z.input<typeof projectSchema>;
export type ProjectOutput = z.output<typeof projectSchema>;