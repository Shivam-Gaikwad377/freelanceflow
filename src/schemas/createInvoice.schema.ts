import { z } from "zod";
import { Document } from "mongoose";


export const createInvoiceSchema = z.object({
  invoiceNumber: z.number().positive("Invoice number must be positive").optional(),
  projectId: z.string().min(1, "Project is required"),
  clientId: z.string().min(1, "Client is required"),
  issueDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  status: z.enum(["pending", "paid", "overdue"]).optional(),
  lineItems: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      quantity: z.number().positive("Quantity must be positive"),
      price: z.number().positive("Price must be positive"),
    })
  ).min(1, "At least one line item is required"),
  project: z.string().min(1, "Project name is required"),
  client: z.string().min(1, "Client name is required"),
  taxRate: z.number().min(0, "Tax rate must be non-negative"),
});

export type CreateInvoiceInput = z.input<typeof createInvoiceSchema>;
export type CreateInvoiceOutput = z.output<typeof createInvoiceSchema>;
