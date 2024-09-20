"use server";
import prisma from "@/lib/prisma";
import { CustomerData } from "@/lib/zodSchemas";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getCustomerById(id: string) {
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
    const customerItem = await prisma.customer.findUnique({
      where: { id },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        ssn: true,
        dateOfBirth: true,
        licenseNumber: true,
      },
    });

    if (!customerItem) {
      return { success: false, error: "Customer not found" };
    }
    revalidatePath("/dashboard/customers");
    return { success: true, customerItem };
  } catch (error) {
    console.error("Failed to get customer data:", error);
    return { success: false, error: "Failed to get customer data" };
  }
}

export async function updateCustomer(id: string, data: CustomerData) {
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
    const customer = await prisma.customer.findUnique({
      where: { id },
    });
    if (!customer) {
      return { success: false, error: "Customer not found" };
    }
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        ...data,
        userId: user.id,
      },
    });
    revalidatePath("/dashboard/customers");
    return { success: true, customer: updatedCustomer };
  } catch (error) {
    console.error("Failed to update customer data:", error);
    return { success: false, error: "Failed to update customer data" };
  }
}

export async function deleteCustomer(id: string) {
  try {
    const { userId } = auth();
    if (!userId) {
      throw new Error("User not authenticated");
    }
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });
    if (!user) {
      throw new Error("User not found in the database");
    }
    const customer = await prisma.customer.findUnique({
      where: { id },
    });
    if (!customer) {
      throw new Error("Customer not found");
    }
    await prisma.customer.delete({
      where: { id },
    });
    revalidatePath("/dashboard/customers");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete inventory:", error);
    throw error;
  }
}
