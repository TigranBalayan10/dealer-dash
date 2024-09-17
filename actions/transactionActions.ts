"use server";

import prisma from "@/lib/prisma";
import { TransactionData } from "@/lib/zodSchemas";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateTransaction(id: string, data: TransactionData) {
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

  try {
    const { financialDetails, ...transactionData } = data;
    const result = await prisma.transaction.update({
      where: { id },
      data: {
        ...transactionData,
        financialDetails: {
          update: financialDetails,
        },
      },
      include: {
        financialDetails: true,
      },
    });
    revalidatePath("/dashboard/transactions");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating transaction:", error);
    return { success: false, error: "Failed to update transaction" };
  }
}
