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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { inventoryItemSchema } from "@/lib/zodSchemas"
import { InventoryItemData } from "@/lib/zodSchemas"
import { parseZodSchema } from "@/lib/zodSchemas";
import { useState } from "react"
import { Form } from "./ui/form"

const InputDialog = () => {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const form = useForm<InventoryItemData>({
        resolver: zodResolver(inventoryItemSchema),
        defaultValues: {
            make: "",
            model: "",
            year: 0,
            price: 0,
            description: "",
            status: "AVAILABLE",
            vin: "",
        },
    })
    const onSubmit = async (data: InventoryItemData) => {
        setSubmitStatus('loading')
        try {
            const parsedData = parseZodSchema(inventoryItemSchema, data);
            console.log(parsedData)
            setSubmitStatus('success')
            form.reset()
        } catch (error) {
            console.error(error)
            setSubmitStatus('error')
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 items-center gap-4">
                            <CustomFormField<InventoryItemData>
                                form={form}
                                name="make"
                                label="Make"
                                placeholder="eg. Toyota"
                            />
                            <CustomFormField<InventoryItemData>
                                form={form}
                                name="model"
                                label="Model"
                                placeholder="eg. Corolla"
                            />
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <CustomFormField<InventoryItemData>
                                form={form}
                                name="year"
                                label="Year"
                                type="number"
                                placeholder="eg. 2021"
                            />
                            <CustomFormField<InventoryItemData>
                                form={form}
                                name="price"
                                label="Price"
                                type="number"
                                placeholder="eg. 20000"
                            />
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <CustomFormField<InventoryItemData>
                                form={form}
                                name="description"
                                label="Description"
                                placeholder="eg. Great condition, low mileage"
                            />
                            <CustomFormField<InventoryItemData>
                                form={form}
                                name="vin"
                                label="VIN"
                                placeholder="eg. 1HGCM82633A404352"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={submitStatus === 'loading'}>
                                {submitStatus === 'loading' ? 'Adding Item...' : 'Add Item'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
                {submitStatus === 'success' && <p className="text-green-500">Inventory added successfully!</p>}
                {submitStatus === 'error' && <p className="text-red-500">Failed to add Inventory. Please try again.</p>}
            </DialogContent>
        </Dialog>
    )
}

export default InputDialog