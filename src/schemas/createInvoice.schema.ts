import { z } from "zod";

export const createInvoiceSchema = z.object({
  invoiceNumber: z.number().positive("Invoice number must be positive").optional(),
  projectId: z.string().min(1, "Project is required"),
  clientId: z.string().min(1, "Client is required"),
  issueDate: z.date(),
  dueDate: z.date(),
  status: z.enum(["pending", "paid", "overdue"]),
  lineItems: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      quantity: z.number().positive("Quantity must be positive"),
      price: z.number().positive("Price must be positive"),
    })
  ).min(1, "At least one line item is required"),
  project: z.string().min(1, "Project name is required"),
  client: z.string().min(1, "Client name is required"),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
