import { z } from "zod";

export const updateInvoiceSchema = z.object({
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  amount: z.number().optional(),
  dueDate: z.string().optional(),
  status: z.enum(["Paid", "pending", "overdue"]).optional(),
  description: z.string().optional(),
  lineItems: z.array(
    z.object({
      description: z.string(),
      quantity: z.number(),
      price: z.number(),
    })
  ).optional(),
  paidAt: z.coerce.date().optional(),
});
