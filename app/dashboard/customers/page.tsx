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

    return await prisma.customer.findMany({
        where: {
            userId: user?.id,
        },
    })
}



const CustomersPage = async () => {
    const { userId } = auth()
    const data = await getData(userId || '')
    return (
        <div className="py-10">
            <DataTable columns={columns} data={data} searchPlaceholder="Filter by First Name..." searchColumn="firstName" />
        </div>
    )
}

export default CustomersPage