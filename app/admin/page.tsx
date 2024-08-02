import Link from "next/link"
import prisma from "@/lib/prisma"

const getUsers = async () => {
    const users = await prisma.user.findMany()
    return users
}
const Admin = async () => {
    const users = await getUsers()
    return (
        <div>
            <h1>Admin Page</h1>
            <Link href="/admin/add-user">
                Add User
            </Link>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.firstName} {user.lastName}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Admin