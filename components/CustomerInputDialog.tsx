"use client";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Icon } from "@iconify/react/dist/iconify.js"
import { CustomFormField } from "./CustomFormFields/CustomFormField"
import { CustomSelectField } from "./CustomFormFields/CustomSelectField";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CustomerData, customerSchema } from "@/lib/zodSchemas"
import states from "@/lib/Data/states.json"
import { parseZodSchema } from "@/lib/zodSchemas";
import { useState } from "react"
import { Form } from "./ui/form"
import ButtonSubmit from "./ButtonSubmit";
import { CustomDatePicker } from "./CustomFormFields/CustomDatePicker";
import { addCustomer } from "@/actions/addCustomerAction";

const CustomerInputDialog = () => {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const form = useForm<CustomerData>({
        resolver: zodResolver(customerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "CA",
            zipCode: "",
            ssn: "",
            dateOfBirth: new Date(),
            licenseNumber: "",
        },
    })
    const onSubmit = async (data: CustomerData) => {
        setSubmitStatus('loading')
        try {
            const parsedData = parseZodSchema(customerSchema, data);
            const result = await addCustomer(parsedData);
            if (result.success) {
                setSubmitStatus('success')
                form.reset()
                setTimeout(() => {
                    setSubmitStatus('idle')
                }, 2000)
            } else {
                setSubmitStatus('error')
                setTimeout(() => {
                    setSubmitStatus('idle')
                }, 2000)
            }
        } catch (error) {
            console.error("Failed to add customer:", error);
            setSubmitStatus('error')
            setTimeout(() => {
                setSubmitStatus('idle')
            }, 2000)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Icon icon="mdi:add-box" className="w-6 h-6 mr-2" />
                    Add Customer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Add Customer
                    </DialogTitle>
                    <DialogDescription>
                        Add a new customer to the database
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 items-center gap-4">
                            <CustomFormField <CustomerData>
                                form={form}
                                name="firstName"
                                label="First Name"
                                placeholder="John"
                            />
                            <CustomFormField <CustomerData>
                                form={form}
                                name="lastName"
                                label="Last Name"
                                placeholder="Doe"
                            />
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <CustomFormField <CustomerData>
                                form={form}
                                name="email"
                                label="Email"
                                placeholder="example@email.com"
                            />
                            <CustomFormField <CustomerData>
                                form={form}
                                name="phone"
                                label="Phone"
                                placeholder="No dashes or spaces"
                            />
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <CustomFormField <CustomerData>
                                form={form}
                                name="address"
                                label="Address"
                                placeholder="123 Main St"
                            />
                            <CustomFormField <CustomerData>
                                form={form}
                                name="city"
                                label="City"
                                placeholder="New York"
                            />
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <CustomSelectField
                                form={form}
                                name="state"
                                label="State"
                                options={states}
                            />
                            <CustomFormField <CustomerData>
                                form={form}
                                name="zipCode"
                                label="Zip"
                                placeholder="12345"
                            />
                        </div>
                        <CustomDatePicker
                            form={form}
                            name="dateOfBirth"
                            label="Date of Birth"
                            placeholder="Select transaction date"
                            disabled={(date) => date > new Date()}
                        />
                        <div className="grid grid-cols-2 items-center gap-4">
                            <CustomFormField <CustomerData>
                                form={form}
                                name="ssn"
                                label="SSN"
                                placeholder="123-45-6789"
                            />
                            <CustomFormField <CustomerData>
                                form={form}
                                name="licenseNumber"
                                label="DL Number"
                                placeholder="F1234567"
                            />
                        </div>
                        <DialogFooter>
                            <ButtonSubmit
                                submitStatus={submitStatus}
                                buttonText="Add Customer"
                            />
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CustomerInputDialog