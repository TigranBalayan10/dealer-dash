"use server";
import prisma from "@/lib/prisma";
import { InventoryItemData } from "@/lib/zodSchemas";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getInventoryById(id: string) {
  try {
    const { userId } = auth();
    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!user) {
      return { success: false, error: "User not found in the database" };
    }
    const inventoryItem = await prisma.inventoryItem.findUnique({
      where: { id },
      select: {
        make: true,
        model: true,
        year: true,
        price: true,
        status: true,
        description: true,
        vin: true,
      },
    });

    if (!inventoryItem) {
      return { success: false, error: "Inventory item not found" };
    }

    // Ensure the status is one of the allowed values
    const validatedItem: InventoryItemData = {
      ...inventoryItem,
      status: inventoryItem.status as InventoryItemData["status"], // Type assertion
      description: inventoryItem.description || "",
    };

    revalidatePath("/dashboard/inventory");
    return { success: true, inventoryItem: validatedItem };
  } catch (error) {
    console.error("Failed to get inventory:", error);
    return { success: false, error: "Failed to get inventory" };
  }
}

export async function updateInventory(
  id: string,
  data: InventoryItemData
): Promise<void> {
  // Implement your update logic here
  // This could be a database update or an API call
}
