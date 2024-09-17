"use client";

import { useState } from "react";
import { Transaction, FinancialDetails } from "@prisma/client";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { TransactionData, transactionSchema } from "@/lib/zodSchemas"
import { updateTransaction } from "@/actions/transactionActions";
import { parseZodSchema } from "@/lib/zodSchemas";
import TransactionForm from "../TransactionForm";

interface EditTransactionSheetProps {
    transactionItem: Transaction & { financialDetails: FinancialDetails | null };
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}


const EditTransactionSheet: React.FC<EditTransactionSheetProps> = ({
    transactionItem,
    isOpen,
    onOpenChange
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const initialValues: TransactionData = {
        type: transactionItem.type,
        amount: transactionItem.amount,
        commission: transactionItem.commission,
        date: new Date(transactionItem.date),
        notes: transactionItem.notes || "",
        inventoryItemId: transactionItem.inventoryItemId,
        customerId: transactionItem.customerId,
        financialDetails: transactionItem.financialDetails || {
            downPayment: 0,
            monthlyPayment: 0,
            leaseTerm: 0,
            interestRate: 0,
            totalLeaseCost: 0,
            residualValue: 0,
        },
    };

    const onSubmit = async (data: TransactionData) => {
        setSubmitStatus('loading');
        try {
            const parsedData = parseZodSchema(transactionSchema, data);
            const result = await updateTransaction(transactionItem.id, parsedData);
            if (result.success) {
                setSubmitStatus('success');
                setTimeout(() => {
                    setSubmitStatus('idle');
                    onOpenChange(false);
                }, 1000);
            } else {
                setSubmitStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        }
    }

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="rightLg">
                <SheetHeader className="mb-6">
                    <SheetTitle>
                        Edit Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Edit the details of this transaction.
                    </SheetDescription>
                </SheetHeader>
                <TransactionForm
                    onSubmit={onSubmit}
                    mode="edit"
                    initialValues={initialValues}
                    isEditing={isEditing}
                    onEnableEdit={() => setIsEditing(true)}
                    submitStatus={submitStatus}
                />
            </SheetContent>
        </Sheet>
    )
}

export default EditTransactionSheet