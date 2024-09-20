// components/DeleteConfirmationDialog.tsx
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import ButtonSubmit from "@/components/ButtonSubmit"

interface DeleteConfirmationDialogProps {
    id: string;
    onDelete: (id: string) => Promise<void>;
    triggerText?: string;
    title?: string;
    description?: string;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
    id,
    onDelete,
    triggerText = "Delete",
    title = "Are you absolutely sure?",
    description = "This action cannot be undone. This will permanently delete the item.",
}) => {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [isOpen, setIsOpen] = useState(false)

    const handleDelete = async () => {
        setSubmitStatus('loading')
        try {
            await onDelete(id)
            setSubmitStatus('success')
            setTimeout(() => {
                setIsOpen(false)
                setSubmitStatus('idle')
            }, 1000) // Close dialog and reset status after 1 second
        } catch (error) {
            console.error("Failed to delete item:", error)
            setSubmitStatus('error')
            setTimeout(() => setIsOpen(false), 2000) // Reset status after 2 seconds
        }
    }

    const getButtonClass = () => {
        switch (submitStatus) {
            case 'success':
                return 'bg-green-500 hover:bg-green-600 text-secondary';
            case 'error':
                return 'bg-red-500 hover:bg-red-600 text-secondary';
            default:
                return 'bg-destructive hover:bg-destructive/80 text-secondary';
        }
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="link" className="text-destructive">{triggerText}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <ButtonSubmit 
                        submitStatus={submitStatus}
                        buttonText="DELETE"
                        onClick={handleDelete}
                        className={getButtonClass()}
                    />
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteConfirmationDialog
