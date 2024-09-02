"use client";

import { useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { InventoryItemData, inventoryItemSchema } from "@/lib/zodSchemas"
import { getInventoryById, updateInventory } from "@/actions/InventoryActions";
import { parseZodSchema } from "@/lib/zodSchemas";
import InventoryForm from "@/components/InventoryForm";
import { Icon } from "@iconify/react/dist/iconify.js";

interface EditInventorySheetProps {
    inventoryId: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}


const EditInventorySheet: React.FC<EditInventorySheetProps> = ({
    inventoryId,
    isOpen,
    onOpenChange
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inventoryItem, setInventoryItem] = useState<InventoryItemData | null>(null);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        if (isOpen && !inventoryItem) {
            setIsLoading(true);
            getInventoryById(inventoryId)
                .then((result) => {
                    if (result.success && result.inventoryItem) {
                        setInventoryItem(result.inventoryItem);
                        setIsEditing(false);
                    } else {
                        console.error("Failed to get inventory item:", result.error);
                        setInventoryItem(null);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching inventory item:", error);
                    setInventoryItem(null);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [inventoryId, isOpen, inventoryItem]);

    const onSubmit = async (data: InventoryItemData) => {
        setSubmitStatus('loading');
        try {
            const parsedData = parseZodSchema(inventoryItemSchema, data);
            if (parsedData.year === null || parsedData.price === null) {
                throw new Error("Year and price must be provided");
            }
            const result = await updateInventory(inventoryId, {
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

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setInventoryItem(null);
            setIsEditing(false);
            setSubmitStatus('idle');
        }
        onOpenChange(open);
    }

    return (
        <Sheet open={isOpen} onOpenChange={handleOpenChange}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        Edit Inventory Item
                    </SheetTitle>
                    <SheetDescription>
                        Edit the details of the inventory item
                    </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                    <div className="p-4 text-center">
                        <Icon icon="mdi:loading" className="w-6 h-6 animate-spin text-primary" />
                    </div>
                ) : inventoryItem ? (
                    <InventoryForm
                        onSubmit={onSubmit}
                        mode="edit"
                        initialValues={inventoryItem}
                        isEditing={isEditing}
                        onEnableEdit={() => setIsEditing(true)}
                        submitStatus={submitStatus}
                    />
                ) : (
                    <h3 className="p-4 text-center text-red-400">
                        Failed to load inventory item. Please try again.
                    </h3>
                )
                }
            </SheetContent>
        </Sheet>
    )
}

export default EditInventorySheet