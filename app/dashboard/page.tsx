import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white p-6 rounded shadow-md max-w-md">
        <h2 className="text-xl font-semibold mb-2">
          Welcome, {session.user.name}!
        </h2>
        <p className="text-gray-700 mb-1">
          <strong>Email:</strong> {session.user.email}
        </p>
        <p className="text-gray-700 mb-1">
          <strong>ID:</strong> {session.user.id}
        </p>
      </div>
    </main>
  );
}
