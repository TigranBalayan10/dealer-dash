// c:\Users\tigra\Documents\My Projects\dealer-dash\actions\addInventoryAction.ts
"use server";

import prisma from "@/lib/prisma";
import { InventoryItemData } from "@/lib/zodSchemas";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function addInventory(data: InventoryItemData) {
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

    const newInventory = await prisma.inventoryItem.create({
      data: {
        ...data,
        userId: user.id, // Use the database user ID
      },
    });
    revalidatePath("/dashboard/inventory");
    return { success: true, inventory: newInventory };
  } catch (error) {
    console.error("Failed to add inventory:", error);
    return { success: false, error: "Failed to add inventory" };
  }
}
