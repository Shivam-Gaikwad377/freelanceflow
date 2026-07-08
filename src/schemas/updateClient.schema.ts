import { z } from "zod";

export const updateClientSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters long").optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export type UpdateClientInput = z.input<typeof updateClientSchema>;
export type UpdateClientOutput = z.output<typeof updateClientSchema>;
