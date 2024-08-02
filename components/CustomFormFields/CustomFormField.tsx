import React from 'react';
import { UseFormReturn, FieldPath } from 'react-hook-form';
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CustomFormFieldProps<T extends Record<string, any>> {
    form: UseFormReturn<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    type?: string;
    inputComponent?: React.ComponentType<any>;
}

export function CustomFormField<T extends Record<string, any>>({
    form,
    name,
    label,
    placeholder,
    type = 'text',
    inputComponent: InputComponent = Input,
}: CustomFormFieldProps<T>) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <InputComponent
                            placeholder={placeholder}
                            type={type}
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}