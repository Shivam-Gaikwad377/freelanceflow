import { z } from "zod";

export const updateTimeLogSchema = z.object({
  startTime: z.date().optional(),
  endTime: z.date().optional(),
  status: z.enum(["active", "completed"]).optional(),
  duration: z.number().optional(),
  projectId: z.uuid().optional(),
});
