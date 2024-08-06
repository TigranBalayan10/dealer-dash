import { auth } from '@clerk/nextjs/server';
import prisma from "@/lib/prisma";

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
    const customers = await prisma.customer.findMany({
        where: {
            userId: user?.id,
        },
    });

    return (
        <div>
            <h1>Dashboard</h1>
            {user ? (
                <>
                    <p>Welcome, {user.firstName} {user.lastName}!</p>
                    <p>Your email address is {user.email}.</p>
                    <p>Business is {user.businessName}</p>
                    <h1>Customers</h1>
                    <ul>
                        {customers.map((customer) => (
                            <li key={customer.id}>{customer.ssn}</li>
                        ))}

                    </ul>
                </>
            ) : (
                <p>Loading user information...</p>
            )}
        </div>
    );
};

export default Dashboard;
