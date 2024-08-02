// components/Navbar.tsx
"use client"
import Link from 'next/link'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { LogoutButton } from './LogoutButton'
import { usePathname } from 'next/navigation'
import path from 'path'

export function Navbar() {
    const pathname = usePathname()
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-100">
            <Link href="/" className="text-xl font-bold">
                Your App Name
            </Link>
            <div className="space-x-4">
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
                    <LogoutButton />
                </SignedIn>
                <SignedOut>
                    <Link href="/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </SignedOut>
            </div>
        </nav>
    )
}