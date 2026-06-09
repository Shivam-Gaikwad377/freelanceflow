import { z } from "zod";

export const updateUserSchema = z.object({
    name: z.string().min(3).optional(),
    bussinessName: z.string().optional(),
    currency: z.string().length(3).optional(),
})