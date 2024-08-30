"use client";

import { useState, useCallback } from "react";
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
import { InventoryItemData, inventoryItemSchema } from "@/lib/zodSchemas"
import { getInventoryById, updateInventory } from "@/actions/InventoryActions";
import { parseZodSchema } from "@/lib/zodSchemas";
import InventoryForm from "./InventoryForm";

interface EditInventoryDialogProps {
    inventoryId: string;
}

const EditInventoryDialog: React.FC<EditInventoryDialogProps> = ({ inventoryId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inventoryItem, setInventoryItem] = useState<InventoryItemData | null>(null);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
        } catch (error) {
            console.error("Error updating inventory:", error);
            setSubmitStatus("error");
        }
        setTimeout(() => {
            setIsOpen(false);
        }, 3000);
    }

    const fetchInventoryItem = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await getInventoryById(inventoryId);
            if (result.success && result.inventoryItem) {
                setInventoryItem(result.inventoryItem);
                setIsEditing(false);
            } else {
                console.error("Failed to get inventory item:", result.error);
                setInventoryItem(null);
            }
        } catch (error) {
            console.error("Error fetching inventory item:", error);
            setInventoryItem(null);
        } finally {
            setIsLoading(false);
        }
    }, [inventoryId]);

    const handleOpenChange = useCallback((open: boolean) => {
        if (open) {
            setIsOpen(true);
            fetchInventoryItem();
        } else {
            setIsOpen(false);
            setInventoryItem(null);
        }
    }, [fetchInventoryItem]);

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Icon icon="mdi:edit" className="w-6 h-6 mr-2" />
                    Edit Inventory
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Edit Inventory
                    </DialogTitle>
                    <DialogDescription>
                        Update the details of this inventory item
                    </DialogDescription>
                </DialogHeader>
                {isLoading ? (
                    <div>Loading inventory item...</div>
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
                    <div>Failed to load inventory item. Please try again.</div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default EditInventoryDialog
