// components/Navbar.tsx
"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import { LogoutButton } from './LogoutButton';
import { Icon } from '@iconify/react';
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="flex items-center justify-between p-4 bg-primary border-b">
            <div className="flex items-center">
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-64 mr-4"
                />
            </div>
            <div className="flex items-center space-x-4">
                <SignedIn>
                    {pathname.includes("admin") ? (
                        <Link href="/admin" className="text-blue-600 hover:underline">
                            Admin Dashboard
                        </Link>
                    ) : (
                        <Link href="/dashboard" className="text-blue-600 hover:underline">
                            Dashboard
                        </Link>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-none">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Icon icon="mdi:account" className="mr-2 h-4 w-4" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Icon icon="mdi:cog" className="mr-2 h-4 w-4" />
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <LogoutButton />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SignedIn>
                <SignedOut>
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </SignedOut>
            </div>
        </nav>
    );
}
