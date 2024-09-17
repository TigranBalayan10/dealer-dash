import { TransactionData, transactionSchema } from "@/lib/zodSchemas"
import { CustomFormField } from "./CustomFormFields/CustomFormField"
import { CustomSelectField } from "./CustomFormFields/CustomSelectField";
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import ButtonSubmit from "./ButtonSubmit";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomDatePicker } from "./CustomFormFields/CustomDatePicker";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { Customer, InventoryItem } from "@prisma/client";
import { getUserData } from "@/actions/getUserData";
import { Separator } from "./ui/separator";
import { CustomTextareaField } from "./CustomFormFields/CustomTextareaField";

interface TransactionFormProps {
    onSubmit: (data: TransactionData) => Promise<void>;
    mode: 'add' | 'edit';
    initialValues?: TransactionData | null;
    isEditing: boolean;
    onEnableEdit?: () => void;
    submitStatus: 'idle' | 'loading' | 'success' | 'error';
}


const TransactionForm: React.FC<TransactionFormProps> = ({
    onSubmit,
    mode,
    initialValues,
    isEditing,
    onEnableEdit,
    submitStatus
}) => {

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
        defaultValues: initialValues || {
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
    return (
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
                            disabled={mode === 'edit' && !isEditing}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <CustomSelectField<TransactionData>
                                form={form}
                                name="customerId"
                                label="Customer"
                                options={customerOptions}
                                placeholder="Select"
                                disabled={mode === 'edit' && !isEditing}
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
                                disabled={mode === 'edit' && !isEditing}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <CustomFormField<TransactionData>
                                form={form}
                                name="amount"
                                label="Amount"
                                type="number"
                                disabled={mode === 'edit' && !isEditing}
                            />
                            <CustomFormField<TransactionData>
                                form={form}
                                name="commission"
                                label="Commission"
                                type="number"
                                disabled={mode === 'edit' && !isEditing}
                            />
                        </div>
                        <CustomDatePicker
                            form={form}
                            name="date"
                            label="Date"
                            placeholder="Select transaction date"
                            disabled={(date) => date > new Date() || (mode === 'edit' && !isEditing)}
                        />
                        <CustomTextareaField<TransactionData>
                            form={form}
                            name="notes"
                            label="Notes"
                            placeholder="Enter notes about the transaction"
                            disabled={mode === 'edit' && !isEditing}
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
                            disabled={mode === 'edit' && !isEditing}
                        />
                        <CustomFormField<TransactionData>
                            form={form}
                            name="financialDetails.monthlyPayment"
                            label="Monthly Payment"
                            type="number"
                            disabled={mode === 'edit' && !isEditing}
                        />
                        <CustomFormField<TransactionData>
                            form={form}
                            name="financialDetails.leaseTerm"
                            label="Lease Term (months)"
                            type="number"
                            disabled={mode === 'edit' && !isEditing}
                        />
                        <CustomFormField<TransactionData>
                            form={form}
                            name="financialDetails.interestRate"
                            label="Interest Rate (%)"
                            type="number"
                            disabled={mode === 'edit' && !isEditing}
                        />
                        <CustomFormField<TransactionData>
                            form={form}
                            name="financialDetails.totalLeaseCost"
                            label="Total Lease Cost"
                            type="number"
                            disabled={mode === 'edit' && !isEditing}
                        />
                        <CustomFormField<TransactionData>
                            form={form}
                            name="financialDetails.residualValue"
                            label="Residual Value"
                            type="number"
                            disabled={mode === 'edit' && !isEditing}
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    {mode === 'edit' && !isEditing ? (
                        <Button variant="outline" onClick={onEnableEdit}>Edit</Button>
                    ) : (
                        <ButtonSubmit
                            submitStatus={submitStatus}
                            buttonText={mode === 'add' ? "Add Transaction" : "Save Changes"}
                        />
                    )}
                </div>
            </form>
        </Form>
    )
}

export default TransactionForm