import { auth } from '@clerk/nextjs/server';
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns as InventoryColumns } from './inventory/columns';
import { columns as CustomersColumns } from './customers/columns';

const getUser = async (userId: string) => {
    return await prisma.user.findUnique({
        where: {
            clerkId: userId,
        },
    });
}

const Dashboard = async () => {
    const { userId } = auth();
    const user = await getUser(userId || '');
    const customersData = await prisma.customer.findMany({
        where: {
            userId: user?.id,
        },
    });
    const inventoryData = await prisma.inventoryItem.findMany({
        where: {
            userId: user?.id,
        },
    });
    // Dummy data for overview cards
    const overviewData = [
        { title: "Total Inventory", value: "256" },
        { title: "Total Customers", value: "15" },
        { title: "Monthly Revenue", value: "$45,231" },
        { title: "Active Deals", value: "23" },
    ];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            {user ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {overviewData.map((item, index) => (
                            <Card key={index}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {item.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{item.value}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Inventory Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable columns={InventoryColumns} data={inventoryData}
                                visibleColumns={["make", "model", "year", "price", "status"]}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Customers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable columns={CustomersColumns} data={customersData} visibleColumns={["firstName", "phone", "dateOfBirth"]} />
                            </CardContent>
                        </Card>
                    </div>
                </>
            ) : (
                <p>Loading user information...</p>
            )}
        </div>
    );
};

export default Dashboard;
