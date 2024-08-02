"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CustomFormField } from './CustomFormFields/CustomFormField'
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { createUser } from "@/actions/userAction"
import { userSchema } from "@/lib/zodSchemas"
import { UserData } from "@/lib/zodSchemas"
import { useState } from "react"

export function AddUserForm() {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const form = useForm<UserData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            clerkId: "",
            email: "",
            firstName: "",
            lastName: "",
            organization: "",
            subscribed: false,
            phone: "",
        },
    })
    const onSubmit = async (data: UserData) => {
        setSubmitStatus('loading')
        const result = await createUser(data)
        if (result.success) {
            setSubmitStatus('success')
            form.reset()
        } else {
            setSubmitStatus('error')
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mx-10">
                <CustomFormField<UserData>
                    form={form}
                    name="clerkId"
                    label="Clerk ID"
                    placeholder="clerk123"
                />
                <CustomFormField<UserData>
                    form={form}
                    name="email"
                    label="Email"
                    placeholder="example@mail.com"
                    type="email"
                />
                <CustomFormField<UserData>
                    form={form}
                    name="firstName"
                    label="First Name"
                    placeholder="John"
                />
                <CustomFormField<UserData>
                    form={form}
                    name="lastName"
                    label="Last Name"
                    placeholder="Doe"
                />
                <CustomFormField<UserData>
                    form={form}
                    name="organization"
                    label="Organization"
                    placeholder="ABC Inc."
                />
                <CustomFormField<UserData>
                    form={form}
                    name="phone"
                    label="Phone"
                    placeholder="1234567890"
                />
                <Button type="submit" disabled={submitStatus === 'loading'}>
                    {submitStatus === 'loading' ? 'Adding User...' : 'Add User'}
                </Button>
                {submitStatus === 'success' && <p className="text-green-500">User added successfully!</p>}
                {submitStatus === 'error' && <p className="text-red-500">Failed to add user. Please try again.</p>}
            </form>
        </Form>
    )
}