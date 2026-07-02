import {z} from "zod";


export const updateProjectSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    budget: z.number().positive().optional(),
    deadline: z.date().optional(),
    status: z.enum(["open", "in progress", "completed"]).optional(),
    isStarted: z.boolean().optional(),
    StartedAt: z.date().optional(),
    client: z.string().min(1, "Client name is required").optional(),
})