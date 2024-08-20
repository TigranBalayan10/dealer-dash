import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { columns as InventoryColumns } from './inventory/columns';
import { columns as CustomersColumns } from './customers/columns';
import { columns as TransactionsColumns } from './transactions/columns';
import { calculateMonthlyRevenue, formatCurrency } from "@/lib/monthlyRevenue";

interface DashboardProps {
    userId: string;
    businessName: string | null;
}


const Dashboard: React.FC<DashboardProps> = async ({ userId, businessName }) => {
    const [customersData, inventoryData, transactionsData] = await Promise.all([
        prisma.customer.findMany({ where: { userId } }),
        prisma.inventoryItem.findMany({ where: { userId } }),
        prisma.transaction.findMany({
            where: { userId },
            include: {
                inventoryItem: true,
                customer: true,
            }
        })
    ]);
    const totalInventory = inventoryData.length;
    const totalCustomers = customersData.length;
    const monthlyRevenue = calculateMonthlyRevenue(transactionsData);

    // Dummy data for overview cards
    const overviewData = [
        { title: "Total Inventory", value: totalInventory.toString() },
        { title: "Total Customers", value: totalCustomers.toString() },
        { title: "Monthly Revenue", value: formatCurrency(monthlyRevenue) },
        { title: "Brokered", value: "23" },
    ];

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4 text-center">Overview</h1>
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

            <div className="grid grid-cols-1 gap-6 mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={TransactionsColumns} data={transactionsData} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
