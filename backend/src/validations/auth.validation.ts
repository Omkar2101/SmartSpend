import { z } from "zod";

export const registerUserSchema = z.object({
  email: z
    .string()
    .email("Invalid email format"),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100)
    .optional(),
});