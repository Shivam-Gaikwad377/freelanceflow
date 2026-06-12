import {z} from "zod";

export const createInvoiceSchema = z.object({
    invoiceNumber: z.number().positive("Invoice number must be a positive number"),
    projectId: z.string().min(1, "Project ID is required"),
    amount: z.number().positive("Amount must be a positive number"),
    dueDate: z.string().min(1, "Due date is required").refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
    status: z.enum(["pending", "paid", "overdue"]).default("pending"),
    lineItems: z.array(
        z.object({
            description: z.string().min(1, "Description is required"),
            quantity: z.number().positive("Quantity must be a positive number"),
            price: z.number().positive("Price must be a positive number"),
        })
    ).min(1, "At least one line item is required"),
});
