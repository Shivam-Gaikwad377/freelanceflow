import { z } from "zod";


export const updateUserSchema = z.object({
    name: z.string().min(3).optional().or(z.literal("")),
    bussinessName: z.string().optional().or(z.literal("")),
    plan: z.enum(["free", "premium"]).optional().or(z.literal("")),
})