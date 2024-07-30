// components/Navbar.tsx
import Link from 'next/link'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { LogoutButton } from './LogoutButton'

export function Navbar() {
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-100">
            <Link href="/" className="text-xl font-bold">
                Your App Name
            </Link>
            <div className="space-x-4">
                <SignedIn>
                    <Link href="/dashboard" className="text-blue-600 hover:underline">
                        Dashboard
                    </Link>
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