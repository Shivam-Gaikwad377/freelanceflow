import { z } from "zod";

export const manualTimeLogSchema = z
  .object({
    userId: z.string().nonempty(),
    projectId: z.string().nonempty(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(), // required, not optional
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "endTime must be after startTime",
    path: ["endTime"],
  });