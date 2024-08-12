// CustomSelectField.tsx
import React from 'react';
import { UseFormReturn, FieldPath, Controller } from 'react-hook-form';
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Option {
    value: string;
    label: string;
}

interface CustomSelectFieldProps<T extends Record<string, any>> {
    form: UseFormReturn<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    options: Option[];
}

export function CustomSelectField<T extends Record<string, any>>({
    form,
    name,
    label,
    placeholder,
    options,
}: CustomSelectFieldProps<T>) {
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
                                <Select
                                    onValueChange={controllerField.onChange}
                                    defaultValue={controllerField.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
