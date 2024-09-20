import DeleteConfirmationDialog from "@/components/Dialogs/DeleteConfirmationDialog"
import { deleteTransaction } from "@/actions/transactionActions"



interface DeleteTransactionProps {
    id: string
}


const DeleteTransaction: React.FC<DeleteTransactionProps> = ({ id }) => {
    const handleDelete = async (id: string) => {
        await deleteTransaction(id)
    }

    return (
        <DeleteConfirmationDialog
            id={id}
            onDelete={handleDelete}
            title="Delete Transaction"
            description="Are you sure you want to delete this transaction? This action cannot be undone."
        />
    )
}

export default DeleteTransaction