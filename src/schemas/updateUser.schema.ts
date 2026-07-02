import { z } from "zod";


export const updateUserSchema = z.object({
    name: z.string().min(3).optional().or(z.literal("")),
    bussinessName: z.string().optional().or(z.literal("")),
    currency: z.string().length(3).optional().or(z.literal("")),
})