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
import { TransactionData, transactionSchema } from "@/lib/zodSchemas"
import { InventoryItem } from "@prisma/client";
import { parseZodSchema } from "@/lib/zodSchemas";
import { useState, useEffect } from "react"
import { getUserData } from "@/actions/getUserData";
import { CustomDatePicker } from "./CustomFormFields/CustomDatePicker";
import { CustomTextareaField } from "./CustomFormFields/CustomTextareaField";
import { Form } from "./ui/form"
import ButtonSubmit from "./ButtonSubmit";

const TransactionInputDialog = () => {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])

    useEffect(() => {
        async function fetchInventoryData() {
            try {
                const userData = await getUserData();
                setInventoryItems(userData.inventoryItems);
            } catch (error) {
                console.error('Failed to fetch user data:', error);
            }
        }

        fetchInventoryData();
    }, []);

    if (!inventoryItems) {
        return <div>Loading...</div>;
    }

    const inventoryOptions = inventoryItems.map((item) => ({
        value: item.id,
        label: `${item.year} ${item.make} ${item.model}`,
    }));

    const form = useForm<TransactionData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: "BROKER",
            amount: 0,
            commission: 0,
            date: new Date(),
            notes: "",
            inventoryItemId: "",
        },
    })
    const onSubmit = async (data: TransactionData) => {
        console.log(data)
        // setSubmitStatus('loading')
        // try {
        //     const parsedData = parseZodSchema(inventoryItemSchema, data);
        //     // Ensure year and price are numbers
        //     if (parsedData.year === null || parsedData.price === null) {
        //         throw new Error("Year and price must be provided");
        //     }

        //     const result = await addInventory({
        //         ...parsedData,
        //         year: parsedData.year,
        //         price: parsedData.price,
        //         status: parsedData.status,
        //     });
        //     if (result.success) {
        //         setSubmitStatus('success')
        //         form.reset()
        //         setTimeout(() => {
        //             setSubmitStatus('idle')
        //         }, 2000)
        //     } else {
        //         setSubmitStatus('error')
        //     }
        // } catch (error) {
        //     console.error("Error submitting form:", error);
        //     setSubmitStatus('error')
        // }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Icon icon="mdi:add-box" className="w-6 h-6 mr-2" />
                    Add Transaction
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Add Transaction
                    </DialogTitle>
                    <DialogDescription>
                        Add a new transaction to the database.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <CustomSelectField<TransactionData>
                            form={form}
                            name="type"
                            label="Type"
                            options={[
                                { value: "BROKER", label: "Broker" },
                                { value: "SELL", label: "Sell" },
                                { value: "LEASE", label: "Lease" },
                            ]}
                        />
                        <CustomSelectField<TransactionData>
                            form={form}
                            name="inventoryItemId"
                            label="Inventory Item"
                            options={inventoryOptions}
                            placeholder="Select an inventory item"
                        />
                        <div className="grid grid-cols-2 items-center gap-4">
                            <CustomFormField<TransactionData>
                                form={form}
                                name="amount"
                                label="Amount"
                                type="number"
                            />
                            <CustomFormField<TransactionData>
                                form={form}
                                name="commission"
                                label="Commission"
                                type="number"
                            />
                        </div>
                        <CustomDatePicker
                            form={form}
                            name="date"
                            label="Date"
                            description="The date when the transaction occurred."
                            placeholder="Select transaction date"
                            disabled={(date) => date > new Date()}
                        />
                        <CustomTextareaField<TransactionData>
                            form={form}
                            name="notes"
                            label="Notes"
                            placeholder="Enter notes about the transaction"
                        />
                        <DialogFooter>
                            <ButtonSubmit
                                submitStatus={submitStatus}
                                buttonText="Add Transaction"
                            />
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default TransactionInputDialog