"use client"

import { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from 'next/navigation'
import { CustomFormField } from './CustomFormFields/CustomFormField'
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { loginSchema } from '@/lib/zodSchemas'
import { LoginData } from '@/lib/zodSchemas'

export function LoginForm() {
    const { isLoaded, signIn, setActive } = useSignIn()
    const [error, setError] = useState("")
    const router = useRouter()

    const form = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: LoginData) {
        if (!isLoaded) return

        try {
            const result = await signIn.create({
                identifier: data.email,
                password: data.password,
            })

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId })
                router.push("/dashboard")
            } else {
                console.error("Sign in failed", result)
                setError("Sign in failed. Please check your credentials and try again.")
            }
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
            setError(err.errors[0].message + " Please contact support.")
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <CustomFormField<LoginData>
                    form={form}
                    name="email"
                    label="Email"
                    placeholder="john@example.com"
                    type="email"
                />
                <CustomFormField<LoginData>
                    form={form}
                    name="password"
                    label="Password"
                    type="password"
                />
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit">Sign In</Button>
            </form>
        </Form>
    )
}