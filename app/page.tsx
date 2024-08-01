import Link from "next/link";


export default async function Home() {
  return (
    <main>
      <h1>Welcome to your new app</h1>
      <Link href="/login">
        Go to login
      </Link>
    </main>
  );
}
