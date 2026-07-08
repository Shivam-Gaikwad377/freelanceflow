import {z} from "zod";


export const updateProjectSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  budget: z.coerce.number().optional(),
  deadline: z.coerce.date().optional(),
  status: z.enum(["open", "in progress", "completed"]).optional(),
  StartedAt: z.coerce.date().optional(),
  client: z.string().optional(),
});

export type UpdateProjectInput = z.input<typeof updateProjectSchema>;
export type UpdateProjectOutput = z.output<typeof updateProjectSchema>;