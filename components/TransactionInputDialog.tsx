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
import { parseZodSchema, TransactionData, transactionSchema } from "@/lib/zodSchemas"
import { useState } from "react"
import { createTransactionWithFinancialDetails } from "@/actions/addTransactionAction";
import TransactionForm from "./TransactionForm";

const TransactionInputDialog = () => {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')


    const onSubmit = async (data: TransactionData) => {
        console.log(data);
        setSubmitStatus('loading')
        try {
            const parsedData = parseZodSchema(transactionSchema, data);
            const result = await createTransactionWithFinancialDetails(parsedData);
            if (result.success) {
                setSubmitStatus('success')
                setTimeout(() => {
                    setSubmitStatus('idle')
                }, 2000)
            } else {
                setSubmitStatus('error')
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error')
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Icon icon="mdi:add-box" className="w-6 h-6 mr-2" />
                    Add Transaction
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-center">Add Transaction</DialogTitle>
                    <DialogDescription className="text-center">Add a new transaction to the database.</DialogDescription>
                </DialogHeader>
                <TransactionForm
                    onSubmit={onSubmit}
                    mode="add"
                    initialValues={null}
                    isEditing={true}
                    onEnableEdit={() => { }}
                    submitStatus={submitStatus}
                />
            </DialogContent>
        </Dialog>
    )
}

export default TransactionInputDialog
