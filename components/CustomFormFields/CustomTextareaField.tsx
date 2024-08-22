import React from 'react';
import { UseFormReturn, FieldPath, Controller } from 'react-hook-form';
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Textarea } from '../ui/textarea';

interface CustomFormFieldProps<T extends Record<string, any>> {
    form: UseFormReturn<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    description?: string;
}


export function CustomTextareaField<T extends Record<string, any>>({
    form,
    name,
    label,
    placeholder,
    description,
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
                                <Textarea
                                    placeholder={placeholder}
                                    {...controllerField}
                                />
                            )}
                        />
                    </FormControl>
                    <FormDescription>{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}