// components/LogoutButton.tsx
"use client"

import { useState } from 'react'
import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export function LogoutButton() {
    const { signOut } = useClerk()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogout = async () => {
        setIsLoading(true)
        try {
            await signOut()
            router.push('/') // Redirect to home page after logout
        } catch (error) {
            console.error('Error during logout:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button onClick={handleLogout} disabled={isLoading}>
            {isLoading ? 'Logging out...' : 'Logout'}
        </Button>
    )
}