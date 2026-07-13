import { z } from "zod";
import { Document } from "mongoose";
export interface ITimeLog extends Document {
  userId: string;
  projectId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  source?: "manual" | "automatic";
  status?: "active" | "completed";
}

export const createTimeLogSchema = z.object({
  userId: z.string().nonempty("User ID is required"),
  projectId: z.string().nonempty("Project ID is required"),
  startTime: z.coerce.date(),
  endTime: z.date().optional(),
  duration: z.number().optional(),
  source: z.enum(["manual", "automatic"]).optional(),
  status: z.enum(["active", "completed"]).optional(),
});

export type CreateTimeLogInput = z.input<typeof createTimeLogSchema>;
export type CreateTimeLogOutput = z.output<typeof createTimeLogSchema>;
