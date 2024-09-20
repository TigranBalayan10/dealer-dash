import { deleteInventory } from "@/actions/InventoryActions"
import DeleteConfirmationDialog from "@/components/Dialogs/DeleteConfirmationDialog"

interface DeleteInventoryItemProps {
    id: string
}

const DeleteInventoryItem: React.FC<DeleteInventoryItemProps> = ({ id }) => {
    const handleDelete = async (itemId: string) => {
        await deleteInventory(itemId)
    }

    return (
        <DeleteConfirmationDialog
            id={id}
            onDelete={handleDelete}
            title="Delete Inventory Item"
            description="Are you sure you want to delete this inventory item? This action cannot be undone."
        />
    )
}

export default DeleteInventoryItem
