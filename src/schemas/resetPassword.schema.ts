import {z} from "zod";

export const resetPasswordSchema = z.object({
    email: z.string().email(),
    verificationToken: z.string().length(6, "Verification token must be 6 characters long"),
    newPassword: z.string().min(8, "New password must be at least 8 characters long"),
});

