"use client";

import { useState } from "react";
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
import { parseZodSchema } from "@/lib/zodSchemas";
import { addInventory } from "@/actions/addInventoryAction";
import InventoryForm from "./InventoryForm";

const InputDialog = () => {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    

    const onSubmit = async (data: InventoryItemData) => {
        setSubmitStatus('loading');
        try {
            const parsedData = parseZodSchema(inventoryItemSchema, data);
            if (parsedData.year === null || parsedData.price === null) {
                throw new Error("Year and price must be provided");
            }

            const result = await addInventory({
                ...parsedData,
                year: parsedData.year,
                price: parsedData.price,
                status: parsedData.status,
            });

            if (!result.success) {
                throw new Error("Failed to add inventory");
            }

            setSubmitStatus('success');
        } catch (error) {
            console.error("Error adding inventory:", error);
            setSubmitStatus('error');
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Icon icon="mdi:add-box" className="w-6 h-6 mr-2" />
                    Add Inventory
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        Add Inventory
                    </DialogTitle>
                    <DialogDescription>
                        Add a new item to your inventory
                    </DialogDescription>
                </DialogHeader>
                <InventoryForm
                    onSubmit={onSubmit}
                    mode="add"
                    isEditing={true}
                    submitStatus={submitStatus}
                />
            </DialogContent>
        </Dialog>
    )
}

export default InputDialog
