import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold">Welcome to KodBanking</h1>
        <div className="flex gap-4">
          <Link href="/register" className="px-6 py-3 bg-blue-500 text-white rounded">
            Register
          </Link>
          <Link href="/login" className="px-6 py-3 bg-green-500 text-white rounded">
            Login
          </Link>
        </div>
      </main>
    </div>
  );
}
