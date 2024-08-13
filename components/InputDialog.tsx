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
import { inventoryItemSchema } from "@/lib/zodSchemas"
import { InventoryItemData } from "@/lib/zodSchemas"
import { parseZodSchema } from "@/lib/zodSchemas";
import { useState } from "react"
import { Form } from "./ui/form"
import { addInventory } from "@/actions/addInventoryAction";
import ButtonSubmit from "./ButtonSubmit";

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
            // Ensure year and price are numbers
            if (parsedData.year === null || parsedData.price === null) {
                throw new Error("Year and price must be provided");
            }

            const result = await addInventory({
                ...parsedData,
                year: parsedData.year,
                price: parsedData.price,
                status: parsedData.status,
            });
            if (result.success) {
                setSubmitStatus('success')
                form.reset()
                setTimeout(() => {
                    setSubmitStatus('idle')
                }, 2000)
            } else {
                setSubmitStatus('error')
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus('error')
        }
    }

    console.log("watch selected status", form.watch("status"))


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
                        <CustomSelectField<InventoryItemData>
                            form={form}
                            name="status"
                            label="Status"
                            options={[
                                { value: "AVAILABLE", label: "Available" },
                                { value: "RESERVED", label: "Reserved" },
                                { value: "SOLD", label: "Sold" },
                                { value: "LEASED", label: "Leased" },
                            ]}
                        />
                        <DialogFooter>
                            <ButtonSubmit
                                submitStatus={submitStatus}
                                buttonText="Add Inventory"
                            />
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default InputDialog