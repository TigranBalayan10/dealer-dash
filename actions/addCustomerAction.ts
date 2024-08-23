// c:\Users\tigra\Documents\My Projects\dealer-dash\actions\addInventoryAction.ts
"use server";

import prisma from "@/lib/prisma";
import { CustomerData } from "@/lib/zodSchemas";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function addCustomer(data: CustomerData) {
  try {
    const { userId } = auth();

    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    // Find the user in the database using the Clerk userId
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found in the database" };
    }

    const newCustomer = await prisma.customer.create({
      data: {
        ...data,
        userId: user.id, // Use the database user ID
      },
    });
    revalidatePath("/dashboard/customers");
    return { success: true, customer: newCustomer };
  } catch (error) {
    console.error("Failed to add inventory:", error);
    return { success: false, error: "Failed to add inventory" };
  }
}
