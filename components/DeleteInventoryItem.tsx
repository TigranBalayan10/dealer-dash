import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { deleteInventory } from "@/actions/InventoryActions"


interface DeleteInventoryItemProps {
    id: string
}


const DeleteInventoryItem: React.FC<DeleteInventoryItemProps> = ({ id }) => {

    const handleDelete = async () => {
        const { success, error } = await deleteInventory(id)
        if (!success) {
            console.error("Failed to delete inventory item:", error)
        }
    }
    return (
        <>
            <DropdownMenuItem
                onClick={handleDelete}
                className="text-red-500"
            >
                Delete
            </DropdownMenuItem>

        </>
    )
}

export default DeleteInventoryItem