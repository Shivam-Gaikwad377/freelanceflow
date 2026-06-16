import { z } from "zod";

export const updateInvoiceSchema = z.object({
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  amount: z.number().optional(),
  dueDate: z.string().optional(),
  status: z.enum(["paid", "unpaid", "overdue"]).optional(),
  description: z.string().optional(),
});
