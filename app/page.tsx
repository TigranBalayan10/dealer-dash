import Link from "next/link";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";


async function getUsers() {
  const users = await prisma.user.findMany();
  revalidatePath("/");
  return users;
}

export default async function Home() {
  const users = await getUsers();
  return (
    <main>
      <h1>Welcome to your new app</h1>

      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.email} {user.firsName}</li>
        ))}
      </ul>
      <Link href="/login">
        Go to login
      </Link>
    </main>
  );
}
