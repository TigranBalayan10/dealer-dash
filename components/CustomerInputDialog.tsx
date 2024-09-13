"use client";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Icon } from "@iconify/react/dist/iconify.js"
import CustomerForm from "./CustomerForm";
import { CustomerData, customerSchema } from "@/lib/zodSchemas"
import { parseZodSchema } from "@/lib/zodSchemas";
import { useState } from "react"
import { addCustomer } from "@/actions/addCustomerAction";

const CustomerInputDialog = () => {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const onSubmit = async (data: CustomerData) => {
        setSubmitStatus('loading')
        try {
            const parsedData = parseZodSchema(customerSchema, data);
            const result = await addCustomer(parsedData);
            if (result.success) {
                setSubmitStatus('success')
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
                <CustomerForm
                    onSubmit={onSubmit}
                    mode="add"
                    isEditing={true}
                    submitStatus={submitStatus}
                />
            </DialogContent>
        </Dialog>
    )
}

export default CustomerInputDialog