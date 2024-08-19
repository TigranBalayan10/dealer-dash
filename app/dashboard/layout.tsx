
import { NavBar } from "@/components/NavBar";
import Sidebar from "@/components/SideBar";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getUser(clerkId: string) {
    const user = await prisma.user.findUnique({
        where: { clerkId },
        select: { id: true, businessName: true }
    })
    if (!user) {
        throw new Error("User not found");
    }
    return user;
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { userId: clerkId } = auth();

    if (!clerkId) {
        redirect("/sign-in");
    }

    const user = await getUser(clerkId);

    return (
        <div>
            <div className="flex h-screen">
                <Sidebar className="w-64 border-r" />
                <div className="flex flex-col flex-1">
                    <NavBar title={user.businessName} />
                    <div className="flex-1 p-6 overflow-auto bg-secondary">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}