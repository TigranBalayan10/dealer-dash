import { columns } from "./columns"
import { auth } from '@clerk/nextjs/server';
import { DataTable } from "@/components/ui/data-table"
import TransactionInputDialog from "@/components/TransactionInputDialog";
import prisma from "@/lib/prisma"

const getData = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: {
            clerkId: userId,
        },
    })

    return await prisma.transaction.findMany({
        where: {
            userId: user?.id,
        },
        include: {
            inventoryItem: true,
            customer: true,
        }
    })
}

const FinancesPage = async () => {
    const { userId } = auth()
    const data = await getData(userId || '')
    return (
        <div className="py-10">
            <TransactionInputDialog />
            <DataTable
                columns={columns}
                data={data}
            />
        </div>
    )
}

export default FinancesPage