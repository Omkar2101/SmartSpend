import { z } from "zod";

export const registerUserSchema = z.object({
  clerkId: z.string().min(1, "Clerk ID is required"),

  email: z
    .string()
    .email("Invalid email format"),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100)
    .optional(),
});