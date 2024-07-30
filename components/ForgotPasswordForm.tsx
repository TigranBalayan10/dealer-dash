// components/ForgotPasswordForm.tsx
"use client"

import { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useSignIn } from "@clerk/nextjs"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const formSchema = z.object({
    method: z.enum(['email', 'phone']),
    identifier: z.string().min(1, "This field is required"),
})

type FormData = z.infer<typeof formSchema>

export function ForgotPasswordForm() {
    const { isLoaded, signIn } = useSignIn()
    const [resetSent, setResetSent] = useState(false)
    const [error, setError] = useState("")

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            method: 'email',
            identifier: "",
        },
    })

    async function onSubmit(data: FormData) {
        if (!isLoaded) return

        try {
            const strategy = data.method === 'email' ? 'reset_password_email_code' : 'reset_password_phone_code'
            await signIn.create({
                strategy,
                identifier: data.identifier,
            })
            setResetSent(true)
        } catch (err: any) {
            console.error(JSON.stringify(err, null, 2))
            setError("An error occurred. Please try again.")
        }
    }

    if (resetSent) {
        return <p>If an account exists for {form.getValues("identifier")}, we've sent a password reset code.</p>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="method"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Reset method</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="email" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Email
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="phone" />
                                        </FormControl>
                                        <FormLabel className="font-normal">
                                            Phone
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="identifier"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{form.watch('method') === 'email' ? 'Email' : 'Phone Number'}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={form.watch('method') === 'email' ? "john@example.com" : "+1234567890"}
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error && <p className="text-red-500">{error}</p>}
                <Button type="submit">Reset Password</Button>
            </form>
        </Form>
    )
}