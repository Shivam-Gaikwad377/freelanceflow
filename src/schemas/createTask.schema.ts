import {z} from "zod";
import { Document } from "mongoose";

export interface ITask extends Document {
    
    projectId: string;
    title: string;
    priority: "low" | "medium" | "high";
    dueDate: Date;
    status: "pending" | "completed" | "overdue";
    completedAt?: Date;
}

export const createTaskSchema = z.object({
 
    projectId: z.string().min(1, "Project ID is required"),
    title: z.string().min(1, "Title is required"),
    priority: z.enum(["low", "medium", "high"]),
    dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
    status: z.enum(["pending", "completed", "overdue"]),
    completedAt: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date format").optional(),
});

export type TaskInput = z.input<typeof createTaskSchema>;
export type TaskOutput = z.output<typeof createTaskSchema>;


