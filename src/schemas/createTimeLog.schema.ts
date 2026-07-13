import { z } from "zod";
import { Document } from "mongoose";
import mongoose from "mongoose";
export interface ITimeLog extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  source?: "manual" | "automatic";
  status?: "active" | "completed";
}

export const createTimeLogSchema = z
  .object({
    userId: z.string().uuid("Invalid User ID"),
    projectId: z.string().uuid("Invalid Project ID"),
    startTime: z.coerce.date(),
    endTime: z.date().optional(),
    duration: z.number().optional(),
    source: z.enum(["manual", "stopwatch"]).optional(),
    status: z.enum(["active", "completed"]).optional(),
  }) .refine((data) => data.endTime ? data.endTime > data.startTime : true, {
    message: "endTime must be after startTime",
    path: ["endTime"],
  });
  

export type CreateTimeLogInput = z.input<typeof createTimeLogSchema>;
export type CreateTimeLogOutput = z.output<typeof createTimeLogSchema>;
