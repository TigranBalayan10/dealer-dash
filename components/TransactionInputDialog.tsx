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
import { CustomFormField } from "./CustomFormFields/CustomFormField"
import { Separator } from "./ui/separator";
import { CustomSelectField } from "./CustomFormFields/CustomSelectField";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TransactionData, transactionSchema } from "@/lib/zodSchemas"
import { InventoryItem, Customer } from "@prisma/client";
import { useState, useEffect } from "react"
import { getUserData } from "@/actions/getUserData";
import { CustomDatePicker } from "./CustomFormFields/CustomDatePicker";
import { CustomTextareaField } from "./CustomFormFields/CustomTextareaField";
import { Form } from "./ui/form"
import ButtonSubmit from "./ButtonSubmit";

const TransactionInputDialog = () => {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
    const [customers, setCustomers] = useState<Customer[]>([])

    useEffect(() => {
        async function fetchInventoryData() {
            try {
                const userData = await getUserData();
                setInventoryItems(userData.inventoryItems);
                setCustomers(userData.customers);
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

    const customerOptions = customers.map((customer) => ({
        value: customer.id,
        label: `${customer.firstName} ${customer.lastName}`,
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
            customerId: "",
            financialDetails: {
                downPayment: 0,
                monthlyPayment: 0,
                leaseTerm: 0,
                interestRate: 0,
                totalLeaseCost: 0,
                residualValue: 0,
            },
        },
    })

    const onSubmit = async (data: TransactionData) => {
        console.log(data)
        // Implement your submit logic here
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-6">
                            {/* General Transaction Details */}
                            <div className="flex-1 space-y-4 w-full sm:w-auto">
                                <h3 className="text-lg font-semibold">Transaction Details</h3>
                                <CustomSelectField<TransactionData>
                                    form={form}
                                    name="inventoryItemId"
                                    label="Inventory Item"
                                    options={inventoryOptions}
                                    placeholder="Select an inventory item"
                                />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <CustomSelectField<TransactionData>
                                        form={form}
                                        name="customerId"
                                        label="Customer"
                                        options={customerOptions}
                                        placeholder="Select"
                                    />
                                    <CustomSelectField<TransactionData>
                                        form={form}
                                        name="type"
                                        label="Type"
                                        options={[
                                            { value: "BROKER", label: "Broker" },
                                            { value: "SALE", label: "Sale" },
                                            { value: "LEASE", label: "Lease" },
                                        ]}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    placeholder="Select transaction date"
                                    disabled={(date) => date > new Date()}
                                />
                                <CustomTextareaField<TransactionData>
                                    form={form}
                                    name="notes"
                                    label="Notes"
                                    placeholder="Enter notes about the transaction"
                                />
                            </div>

                            {/* Separator for desktop view */}
                            <div className="hidden sm:block">
                                <Separator orientation="vertical" className="h-full" />
                            </div>

                            {/* Financial Details */}
                            <div className="flex-1 space-y-4 w-full sm:w-auto">
                                <h3 className="text-lg font-semibold">Financial Details</h3>
                                <CustomFormField<TransactionData>
                                    form={form}
                                    name="financialDetails.downPayment"
                                    label="Down Payment"
                                    type="number"
                                    placeholder="Enter down payment amount"
                                />
                                <CustomFormField<TransactionData>
                                    form={form}
                                    name="financialDetails.monthlyPayment"
                                    label="Monthly Payment"
                                    type="number"
                                />
                                <CustomFormField<TransactionData>
                                    form={form}
                                    name="financialDetails.leaseTerm"
                                    label="Lease Term (months)"
                                    type="number"
                                />
                                <CustomFormField<TransactionData>
                                    form={form}
                                    name="financialDetails.interestRate"
                                    label="Interest Rate (%)"
                                    type="number"
                                />
                                <CustomFormField<TransactionData>
                                    form={form}
                                    name="financialDetails.totalLeaseCost"
                                    label="Total Lease Cost"
                                    type="number"
                                />
                                <CustomFormField<TransactionData>
                                    form={form}
                                    name="financialDetails.residualValue"
                                    label="Residual Value"
                                    type="number"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <ButtonSubmit
                                submitStatus={submitStatus}
                                buttonText="Add Transaction"
                            />
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default TransactionInputDialog
