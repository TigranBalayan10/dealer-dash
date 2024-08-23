"use server";

import prisma from "@/lib/prisma";
import { TransactionData } from "@/lib/zodSchemas";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createTransactionWithFinancialDetails(
  data: TransactionData
) {
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

    const result = await prisma.transaction.create({
      data: {
        ...transactionData,
        userId: user.id, // Use the database user ID
        financialDetails: {
          create: financialDetails,
        },
      },
      include: {
        financialDetails: true,
      },
    });

    revalidatePath("/dashboard/transactions");

    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating transaction:", error);
    return { success: false, error: "Failed to create transaction" };
  }
}
