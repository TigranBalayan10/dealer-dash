"use client"

import { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useSignIn } from "@clerk/nextjs"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(1, "Password is required."),
})

type FormData = z.infer<typeof formSchema>

export function LoginForm() {
    const { isLoaded, signIn, setActive } = useSignIn()
    const [error, setError] = useState("")
    const router = useRouter()

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: FormData) {
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
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit">Sign In</Button>
            </form>
        </Form>
    )
}