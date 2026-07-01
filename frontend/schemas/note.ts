import { z } from "zod";

export const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  shareType: z.enum(["ONE_TIME", "TIME_BASED"], {
    errorMap: () => ({ message: "Share link expiry type must be ONE_TIME or TIME_BASED" }),
  }),
  accessType: z.enum(["PUBLIC", "PASSWORD_PROTECTED"], {
    errorMap: () => ({ message: "Access type must be PUBLIC or PASSWORD_PROTECTED" }),
  }),
  expiryAt: z.string().optional().nullable().refine((val) => {
    if (!val) return true;
    const date = new Date(val);
    return !isNaN(date.getTime()) && date > new Date();
  }, {
    message: "Expiry date must be a valid future date",
  }),
});

export const unlockNoteSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UnlockNoteInput = z.infer<typeof unlockNoteSchema>;
