import {z} from "zod";

export const updateProjectSchema = z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    budget: z.number().positive().optional(),
    deadline: z.string().optional(),
    status: z.enum(["open", "in Progress", "completed"]).optional(),
    isStarted: z.boolean().optional(),
    StartedAt: z.string().optional(),
})