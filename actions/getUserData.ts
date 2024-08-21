// app/dashboard/actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function getUserData() {
  const { userId: clerkId } = auth();
  if (!clerkId) {
    throw new Error("Not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: {
      inventoryItems: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
