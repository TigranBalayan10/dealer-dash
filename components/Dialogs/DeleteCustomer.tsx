import DeleteConfirmationDialog from "@/components/Dialogs/DeleteConfirmationDialog"
import { deleteCustomer } from "@/actions/customerActions"


interface DeleteCustomerProps {
    id: string
}


const DeleteCustomer: React.FC<DeleteCustomerProps> = ({ id }) => {
    const handleDelete = async (id: string) => {
        await deleteCustomer(id)
    }

    return (
        <DeleteConfirmationDialog
            id={id}
            onDelete={handleDelete}
            title="Delete Customer"
            description="Are you sure you want to delete this customer? This action cannot be undone."
        />
    )
}

export default DeleteCustomer