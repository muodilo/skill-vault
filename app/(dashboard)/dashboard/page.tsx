import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DashboardStats from "@/components/dashboard";
import Skills from "@/components/skills/skills";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="py-4">
      <DashboardStats />
      <Skills />
    </main>
  );
}
