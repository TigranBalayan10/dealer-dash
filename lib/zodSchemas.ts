import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: "Invalid email" }),
  password: z.string().min(1, "Password is required."),
});

export type LoginData = z.infer<typeof loginSchema>;
