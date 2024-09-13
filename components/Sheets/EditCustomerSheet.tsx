"use client";

import { useState } from "react";
import { Customer } from "@prisma/client";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { CustomerData, customerSchema } from "@/lib/zodSchemas"
import { updateInventory } from "@/actions/InventoryActions";
import { parseZodSchema } from "@/lib/zodSchemas";
import CustomerForm from "../CustomerForm";
import { updateCustomer } from "@/actions/customerActions";

interface EditCustomerSheetProps {
    customer: Customer;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}


const EditCustomerSheet: React.FC<EditCustomerSheetProps> = ({
    customer,
    isOpen,
    onOpenChange
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const initialValues: CustomerData = {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        zipCode: customer.zipCode,
        ssn: customer.ssn || "",
        dateOfBirth: new Date(customer.dateOfBirth),
        licenseNumber: customer.licenseNumber || "",
    };

    const onSubmit = async (data: CustomerData) => {
        setSubmitStatus('loading');
        try {
            const parsedData = parseZodSchema(customerSchema, data);
            if (parsedData.dateOfBirth === null) {
                throw new Error("Date of birth must be provided");
            }
            const result = await updateCustomer(customer.id, {
                ...parsedData,
                dateOfBirth: parsedData.dateOfBirth,
            });
            if (!result.success) {
                throw new Error("Failed to update customer");
            }
            setSubmitStatus('success');
            onOpenChange(false);
        } catch (error) {
            console.error("Error updating customer:", error);
            setSubmitStatus("error");
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        Edit Inventory Item
                    </SheetTitle>
                    <SheetDescription>
                        Edit the details of the inventory item
                    </SheetDescription>
                </SheetHeader>
                <CustomerForm
                    onSubmit={onSubmit}
                    mode="edit"
                    initialValues={initialValues}
                    isEditing={isEditing}
                    onEnableEdit={() => setIsEditing(true)}
                    submitStatus={submitStatus}
                />
            </SheetContent>
        </Sheet>
    )
}

export default EditCustomerSheet