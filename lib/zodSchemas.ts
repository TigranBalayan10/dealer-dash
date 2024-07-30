import { z } from "zod";

export const userSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, { message: "First name must be at least 2 characters long" }),
  lastName: z
    .string()
    .trim()
    .min(2, { message: "Last name must be at least 2 characters long" }),
  email: z.string().toLowerCase().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});


export type User = z.infer<typeof userSchema>;