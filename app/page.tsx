import Link from "next/link";
export default function Home() {
  return (
    <main>
      <h1>Welcome to your new app</h1>
      <p>
        Get started by editing <code>pages/index.tsx</code>
      </p>
      <Link href="/login">
        Go to login
      </Link>
    </main>
  );
}
