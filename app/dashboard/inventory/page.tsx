import { columns } from "./columns"
import { auth } from '@clerk/nextjs/server';
import { DataTable } from "@/components/ui/data-table"
import InputDialog from "@/components/InputDialog";
import prisma from "@/lib/prisma"

const getData = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            clerkId: userId,
        },
    })

    return await prisma.inventoryItem.findMany({
        where: {
            userId: user?.id,
        },
    })
}

const InventoryPage = async () => {
    const { userId } = auth()
    const data = await getData(userId || '')

    return (
        <div className="py-10">
            <InputDialog />
            <DataTable columns={columns} data={data} searchPlaceholder="Filter by make..." searchColumn="make" />
        </div>
    )
}

export default InventoryPage