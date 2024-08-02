"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CustomFormField } from './CustomFormFields/CustomFormField'
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { userSchema } from "@/lib/zodSchemas"
import { UserData } from "@/lib/zodSchemas"

export function AddUserForm() {

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
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(data => console.log(data))} className="space-y-8 mx-10">
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
                <Button type="submit">Add User</Button>
            </form>
        </Form>
    )
}