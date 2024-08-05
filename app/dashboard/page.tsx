import { auth, currentUser } from '@clerk/nextjs/server';
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

    return (
        <div>
            <h1>Dashboard</h1>
            {user ? (
                <>
                    <p>Welcome, {user.firstName} {user.lastName}!</p>
                    <p>Your email address is {user.email}.</p>
                    <p>Business is {user.businessName}</p>
                </>
            ) : (
                <p>Loading user information...</p>
            )}
        </div>
    );
};

export default Dashboard;
