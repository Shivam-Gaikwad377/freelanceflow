import {z} from "zod";

export const updateTaskSchema = z.object({
  title: z.string().optional(),
  
  status: z.enum(["pending", "completed", "overdue"]).optional(),
  dueDate: z.coerce.date().optional(),
  projectId: z.string().optional(),
  completedAt: z.coerce.date().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),

});