import { z } from "zod";

export const createClientSchema = z.object({
    name: z.string().min(1, "Name is required"),    
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    company: z.string().min(1, "Company name is required"),
    status: z.enum(["active", "inactive"]).default("active"),
});