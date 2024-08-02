"use server";

import prisma from "@/lib/prisma";
import { UserData } from "@/lib/zodSchemas";

export async function createUser(data: UserData) {
  try {
    const newUser = await prisma.user.create({
      data: {
        clerkId: data.clerkId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        organization: data.organization,
        subscribed: data.subscribed,
        phone: data.phone,
      },
    });
    return { success: true, user: newUser };
  } catch (error) {
    console.error("Failed to create user:", error);
    return { success: false, error: "Failed to create user" };
  }
}
