import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="px-5 py-4">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        <div></div>
      </div>

    </main>
  );
}
