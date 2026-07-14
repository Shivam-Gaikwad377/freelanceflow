// schemas/manualTimeLog.schema.ts
import { z } from "zod";

// --- Client-side form schema: parses raw "HH:MM" / "HH:MM:SS" from <input type="time"> ---
const timeStringSchema = z
  .string()
  .min(1, "Time is required")
  .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "Invalid time format")
  .transform((value) => {
    const [hours, minutes, seconds = "0"] = value.split(":");
    const date = new Date();
    date.setHours(Number(hours), Number(minutes), Number(seconds), 0);
    return date;
  });

export const manualTimeLogFormSchema = z
  .object({
    projectId: z.string().nonempty(),
    startTime: timeStringSchema,
    endTime: timeStringSchema,
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "endTime must be after startTime",
    path: ["endTime"],
  });

export type ManualTimeLogInput = z.input<typeof manualTimeLogFormSchema>;
export type ManualTimeLogOutput = z.output<typeof manualTimeLogFormSchema>;

// --- API-side schema: validates what the server actually receives (ISO strings after JSON.stringify) ---
export const manualTimeLogApiSchema = z
  .object({
    projectId: z.string().nonempty(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "endTime must be after startTime",
    path: ["endTime"],
  });