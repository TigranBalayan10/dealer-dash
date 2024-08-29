import { InventoryItemData, inventoryItemSchema } from "@/lib/zodSchemas"
import { CustomFormField } from "./CustomFormFields/CustomFormField"
import { CustomSelectField } from "./CustomFormFields/CustomSelectField";
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Form } from "@/components/ui/form"
import ButtonSubmit from "./ButtonSubmit";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";

interface InventoryFormProps {
    onSubmit: (data: InventoryItemData) => Promise<void>;
    mode: 'add' | 'edit';
    initialValues?: InventoryItemData | null;
    isEditing: boolean;
    onEnableEdit?: () => void;
    submitStatus: 'idle' | 'loading' | 'success' | 'error';
}


const InventoryForm: React.FC<InventoryFormProps> = ({
    onSubmit,
    mode,
    initialValues,
    isEditing,
    onEnableEdit,
    submitStatus
}) => {
    const form = useForm<InventoryItemData>({
        resolver: zodResolver(inventoryItemSchema),
        defaultValues: initialValues || {
            make: "",
            model: "",
            year: 0,
            price: 0,
            description: "",
            status: "AVAILABLE",
            vin: "",
        },
    })
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <div className="grid grid-cols-2 items-center gap-4">
                    <CustomFormField<InventoryItemData>
                        form={form}
                        name="make"
                        label="Make"
                        placeholder="Toyota"
                        disabled={mode === 'edit' && !isEditing}
                    />
                    <CustomFormField<InventoryItemData>
                        form={form}
                        name="model"
                        label="Model"
                        placeholder="Camry"
                        disabled={mode === 'edit' && !isEditing}
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <CustomFormField<InventoryItemData>
                        form={form}
                        name="year"
                        label="Year"
                        type="number"
                        placeholder="2021"
                        disabled={mode === 'edit' && !isEditing}
                    />
                    <CustomFormField<InventoryItemData>
                        form={form}
                        name="price"
                        label="Price"
                        type="number"
                        placeholder="20000"
                        disabled={mode === 'edit' && !isEditing}
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <CustomFormField<InventoryItemData>
                        form={form}
                        name="description"
                        label="Description"
                        placeholder="Great condition, low mileage"
                        disabled={mode === 'edit' && !isEditing}
                    />
                    <CustomFormField<InventoryItemData>
                        form={form}
                        name="vin"
                        label="VIN"
                        placeholder="1HGCM82633A404352"
                        disabled={mode === 'edit' && !isEditing}
                    />
                </div>
                <CustomSelectField<InventoryItemData>
                    form={form}
                    name="status"
                    label="Status"
                    disabled={mode === 'edit' && !isEditing}
                    options={[
                        { value: "AVAILABLE", label: "Available" },
                        { value: "RESERVED", label: "Reserved" },
                        { value: "SOLD", label: "Sold" },
                        { value: "LEASED", label: "Leased" },
                    ]}
                />
                <DialogFooter>
                    {mode === 'edit' && !isEditing ? (
                       <Button  onClick={onEnableEdit}>Edit</Button>
                    ) : (
                        <ButtonSubmit
                            submitStatus={submitStatus}
                            buttonText={mode === 'add' ? "Add Inventory" : "Save Changes"}
                        />
                    )}
                </DialogFooter>
            </form>
        </Form>
    )
}

export default InventoryForm