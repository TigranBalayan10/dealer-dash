import React from 'react';
import { UseFormReturn, FieldPath, Controller } from 'react-hook-form';
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
                        <Controller
                            name={name}
                            control={form.control}
                            render={({ field: controllerField }) => (
                                <InputComponent
                                    placeholder={placeholder}
                                    type={type}
                                    inputMode={type === 'number' ? 'numeric' : 'text'}
                                    pattern={type === 'number' ? '[0-9]*' : undefined}
                                    {...controllerField}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const value = type === 'number' ?
                                            e.target.value === '' ? null : Number(e.target.value)
                                            : e.target.value;
                                        controllerField.onChange(value);
                                    }}
                                />

                            )}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}