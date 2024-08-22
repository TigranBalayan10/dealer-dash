import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: "Invalid email" }),
  password: z.string().min(1, "Password is required."),
});

export const userSchema = z.object({
  clerkId: z.string().trim().min(1, "Clerk ID is required."),
  email: z.string().trim().toLowerCase().email({ message: "Invalid email" }),
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  businessName: z.string().optional(),
  subscribed: z.boolean().default(false),
  phone: z
    .string()
    .regex(/^[0-9]+$/, { message: "Invalid phone number" })
    .length(10, { message: "Phone number must be 10 digits" })
    .transform(
      (val) => `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6, 10)}`
    ),
});

export const inventoryItemSchema = z.object({
  make: z.string().trim().min(1, "Make is required."),
  model: z.string().trim().min(1, "Model is required."),
  year: z
    .number()
    .int({ message: "Year must be an integer." })
    .min(1900, "Year must be 1900 or later.")
    .max(2100, "Year must be 2100 or earlier.")
    .nullable()
    .refine((val) => val !== null, { message: "Year is required." }),
  price: z
    .number({ invalid_type_error: "Price must be a number." })
    .min(0, "Price cannot be negative.")
    .nullable()
    .refine((val) => val !== null, { message: "Price is required." }),
  description: z.string().optional(),
  status: z.enum(["AVAILABLE", "RESERVED", "SOLD", "LEASED"], {
    errorMap: () => ({ message: "Please select a valid status." }),
  }),
  vin: z
    .string()
    .trim()
    .toUpperCase()
    .min(17, { message: "VIN must be 17 characters" })
    .max(17, { message: "VIN must be 17 characters" }),
});

const financialDetailsSchema = z.object({
  downPayment: z
    .number({ invalid_type_error: "Down payment must be a number." })
    .min(0, "Down payment cannot be negative.").optional(),
  monthlyPayment: z
    .number({ invalid_type_error: "Monthly payment must be a number." })
    .min(0, "Monthly payment cannot be negative.").optional(),
  leaseTerm: z
    .number({ invalid_type_error: "Term must be a number." })
    .min(0, "Term cannot be negative.").optional(),
  interestRate: z
    .number({ invalid_type_error: "APR must be a number." })
    .min(0, "APR cannot be negative.").optional(),
  totalLeaseCost: z
    .number({ invalid_type_error: "Total lease cost must be a number." })
    .min(0, "Total lease cost cannot be negative.").optional(),
  residualValue: z
    .number({ invalid_type_error: "Residual value must be a number." })
    .min(0, "Residual value cannot be negative.").optional(),
});
export const transactionSchema = z.object({
  type: z.enum(["BROKER", "SALE", "LEASE"], {
    errorMap: () => ({ message: "Please select a valid transaction type." }),
  }),
  amount: z
    .number({ invalid_type_error: "Price must be a number." })
    .min(0, "Price cannot be negative."),
  commission: z
    .number({ invalid_type_error: "Price must be a number." })
    .min(0, "Price cannot be negative."),
  date: z.date().default(() => new Date()),
  notes: z.string().optional(),
  inventoryItemId: z.string().trim(),
  customerId: z.string().trim(),
  financialDetails: financialDetailsSchema.optional(),
});

export const customerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  email: z.string().trim().email({ message: "Invalid email" }),
  phone: z
    .string()
    .regex(/^[0-9]+$/, { message: "Invalid phone number" })
    .length(10, { message: "Phone number must be 10 digits" })
    .transform(
      (val) => `${val.slice(0, 3)}-${val.slice(3, 6)}-${val.slice(6, 10)}`
    ),
  address: z.string().trim().min(1, "Address is required."),
  city: z.string().trim().min(1, "City is required."),
  state: z.string().trim().length(2, { message: "State must be 2 characters" }),
  zip: z.string().trim().length(5, { message: "Zip code must be 5 digits" }),
  ssn: z.string().trim().length(9, { message: "SSN must be 9 digits" }),
  dateOfBirth: z.date(),
  licenseNumber: z.string().trim().min(1, "License number is required."),
});

export function parseZodSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

export type LoginData = z.infer<typeof loginSchema>;
export type UserData = z.infer<typeof userSchema>;
export type InventoryItemData = z.infer<typeof inventoryItemSchema>;
export type TransactionData = z.infer<typeof transactionSchema>;
export type CustomerData = z.infer<typeof customerSchema>;
export type FinancialDetails = z.infer<typeof financialDetailsSchema>;
