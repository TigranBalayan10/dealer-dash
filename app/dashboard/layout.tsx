// app/dashboard/layout.tsx
import { NavBar } from "@/components/NavBar";
import Sidebar from "@/components/SideBar";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from 'next/navigation';
import React, { cloneElement, ReactElement } from 'react';

async function getUser(clerkId: string) {
    const user = await prisma.user.findUnique({
        where: { clerkId },
        select: {
            id: true,
            businessName: true,
        }
    });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

export default async function DashboardLayout({
    children
}: {
    children: React.ReactNode
}) {
    const { userId: clerkId } = auth();

    if (!clerkId) {
        redirect('/sign-in');
    }

    const user = await getUser(clerkId);

    const childrenWithProps = React.Children.map(children, (child) => {
        // Check if the child is a valid element
        if (React.isValidElement(child)) {
            // Clone the child element and pass props
            return cloneElement(child as ReactElement, { userId: user.id, businessName: user.businessName });
        }
        return child;
    });

    return (
        <div className="flex h-screen">
            <Sidebar className="w-64 border-r" />
            <div className="flex flex-col flex-1">
                <NavBar title={user.businessName || ''} />
                <div className="flex-1 p-6 overflow-auto bg-secondary">
                    {childrenWithProps}
                </div>
            </div>
        </div>
    );
}
