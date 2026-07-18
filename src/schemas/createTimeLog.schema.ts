import { z } from "zod";
import { Document } from "mongoose";
import mongoose from "mongoose";


export const createTimeLogSchema = z
  .object({
    userId: z.string().min(1, "User ID is required"),
    projectId: z.string().min(1, "Project ID is required"),
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
