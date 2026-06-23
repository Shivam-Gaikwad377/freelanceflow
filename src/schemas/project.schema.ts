import {z} from "zod";


export const projectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    budget: z.number().positive("Budget must be a positive number"),
    deadline: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date format"),
    status: z.enum(["open", "in progress", "completed"]),
    clientID: z.string().min(1, "Client ID is required").optional(),
    client: z.string().min(1, "Client name is required"),
    
})