"use client";

import { useState } from "react";
import { InventoryItem } from "@prisma/client";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { InventoryItemData, inventoryItemSchema } from "@/lib/zodSchemas"
import { updateInventory } from "@/actions/InventoryActions";
import { parseZodSchema } from "@/lib/zodSchemas";
import InventoryForm from "@/components/InventoryForm";

interface EditInventorySheetProps {
    inventoryItem: InventoryItem;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}


const EditInventorySheet: React.FC<EditInventorySheetProps> = ({
    inventoryItem,
    isOpen,
    onOpenChange
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const initialValues: InventoryItemData = {
        make: inventoryItem.make,
        model: inventoryItem.model,
        year: inventoryItem.year,
        price: inventoryItem.price,
        status: inventoryItem.status,
        vin: inventoryItem.vin,
    };

    const onSubmit = async (data: InventoryItemData) => {
        setSubmitStatus('loading');
        try {
            const parsedData = parseZodSchema(inventoryItemSchema, data);
            if (parsedData.year === null || parsedData.price === null) {
                throw new Error("Year and price must be provided");
            }
            const result = await updateInventory(inventoryItem.id, {
                ...parsedData,
                year: parsedData.year,
                price: parsedData.price,
                status: parsedData.status,
            });
            if (!result.success) {
                throw new Error("Failed to update inventory");
            }
            setSubmitStatus('success');
            onOpenChange(false);
        } catch (error) {
            console.error("Error updating inventory:", error);
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
                <InventoryForm
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

export default EditInventorySheet