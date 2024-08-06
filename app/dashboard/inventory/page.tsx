import { columns } from "./columns"
import { auth } from '@clerk/nextjs/server';
import { DataTable } from "@/components/ui/data-table"
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
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} />
        </div>
    )
}

export default InventoryPage