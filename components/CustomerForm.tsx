import { CustomerData, customerSchema } from "@/lib/zodSchemas"
import { CustomFormField } from "./CustomFormFields/CustomFormField"
import { CustomSelectField } from "./CustomFormFields/CustomSelectField";
import { useForm } from "react-hook-form"
import states from "@/lib/Data/states.json"
import { Form } from "@/components/ui/form"
import ButtonSubmit from "./ButtonSubmit";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "./ui/dialog";
import { CustomDatePicker } from "./CustomFormFields/CustomDatePicker";
import { Button } from "./ui/button";

interface CustomerFormProps {
    onSubmit: (data: CustomerData) => Promise<void>;
    mode: 'add' | 'edit';
    initialValues?: CustomerData | null;
    isEditing: boolean;
    onEnableEdit?: () => void;
    submitStatus: 'idle' | 'loading' | 'success' | 'error';
}


const CustomerForm: React.FC<CustomerFormProps> = ({
    onSubmit,
    mode,
    initialValues,
    isEditing,
    onEnableEdit,
    submitStatus
}) => {
    const form = useForm<CustomerData>({
        resolver: zodResolver(customerSchema),
        defaultValues: initialValues || {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "CA",
            zipCode: "",
            ssn: "",
            dateOfBirth: new Date(),
            licenseNumber: "",
        },
    })
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <div className="grid grid-cols-2 items-center gap-4">
                    <CustomFormField <CustomerData>
                        form={form}
                        name="firstName"
                        label="First Name"
                        placeholder="John"
                        disabled={mode === 'edit' && !isEditing}
                    />
                    <CustomFormField <CustomerData>
                        form={form}
                        name="lastName"
                        label="Last Name"
                        placeholder="Doe"
                        disabled={mode === 'edit' && !isEditing}
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <CustomFormField <CustomerData>
                        form={form}
                        name="email"
                        label="Email"
                        placeholder="example@email.com"
                        disabled={mode === 'edit' && !isEditing}
                    />
                    <CustomFormField <CustomerData>
                        form={form}
                        name="phone"
                        label="Phone"
                        placeholder="No dashes or spaces"
                        disabled={mode === 'edit' && !isEditing}
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <CustomFormField <CustomerData>
                        form={form}
                        name="address"
                        label="Address"
                        placeholder="123 Main St"
                        disabled={mode === 'edit' && !isEditing}
                    />
                    <CustomFormField <CustomerData>
                        form={form}
                        name="city"
                        label="City"
                        placeholder="New York"
                        disabled={mode === 'edit' && !isEditing}
                    />
                </div>
                <div className="grid grid-cols-2 items-center gap-4">
                    <CustomSelectField
                        form={form}
                        name="state"
                        label="State"
                        disabled={mode === 'edit' && !isEditing}
                        options={states}
                    />
                    <CustomFormField <CustomerData>
                        form={form}
                        name="zipCode"
                        label="Zip"
                        placeholder="12345"
                        disabled={mode === 'edit' && !isEditing}
                    />
                </div>
                <CustomDatePicker
                    form={form}
                    name="dateOfBirth"
                    label="Date of Birth"
                    placeholder="Select transaction date"
                    disabled={(date) => date > new Date() || (mode === 'edit' && !isEditing)}
                />
                <div className="grid grid-cols-2 items-center gap-4">
                    <CustomFormField <CustomerData>
                        form={form}
                        name="ssn"
                        label="SSN"
                        placeholder="123-45-6789"
                        disabled={mode === 'edit' && !isEditing}
                    />
                    <CustomFormField <CustomerData>
                        form={form}
                        name="licenseNumber"
                        label="DL Number"
                        placeholder="F1234567"
                        disabled={mode === 'edit' && !isEditing}
                    />
                </div>
                <DialogFooter>
                    {mode === 'edit' && !isEditing ? (
                        <Button variant="outline" onClick={onEnableEdit}>Edit</Button>
                    ) : (
                        <ButtonSubmit
                            submitStatus={submitStatus}
                            buttonText={mode === 'add' ? "Add Customer" : "Save Changes"}
                        />
                    )}
                </DialogFooter>
            </form>
        </Form>
    )
}

export default CustomerForm